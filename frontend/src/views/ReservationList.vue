<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import type {Reservation} from "@/model/Reservation";
import {useReservationService} from "@/composables/useReservationService";
import Error from "@/components/Error.vue";
import Loading from "@/components/Loading.vue";
import {StatusTypes} from "@/model/StatusTypes";

const reservationService = useReservationService()

const reservations = ref<Array<Reservation>>([]);

async function fetchData() {
  try {
    await reservationService.getReservationsByUser()
    reservations.value = reservationService.reservations.value.sort((a, b) => {
      const dateComparison = new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      if (dateComparison === 0) {
        return a.vehicleName.localeCompare(b.vehicleName)
      }
      return dateComparison
    })
  } catch (error) {
    console.error('Error fetching reservations:', error)
  }
}

const cancelReservation = async (reservation: Reservation) => {
  reservation.status = StatusTypes.CANCELED
  await reservationService.updateReservation(reservation)
  await fetchData()
};

const selectOptions = ['vše'].concat(Object.values(StatusTypes))

const selectedStatusType = ref(selectOptions[0])

const filteredReservations = computed(()=>{
  if (Object.values(StatusTypes).includes(selectedStatusType.value as StatusTypes)){
    if (reservations.value.map((r)=>r.status).includes(selectedStatusType.value as StatusTypes)){
      return reservations.value.filter((r)=>{
        return r.status === selectedStatusType.value
      })
    }
  }
  else return reservations.value
})

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <v-container >
    <v-col cols="12" class="text-center" v-if="reservationService.loading.value">
      <Loading />
    </v-col>
    <Error v-else-if="reservationService.error.value" message="Nepovedlo se načíst rezervace :(" />
    <v-row v-else justify="center">

      <v-col cols="12" class="text-center">
        <h1 class="text-h2 font-weight-bold">Vaše rezervace</h1>
      </v-col>

      <v-col v-if="reservations.length===0" cols="12" class="text-center">
        <h1 class="text-h4">Nemáte žádné rezervace</h1>
      </v-col>

      <v-col v-else>
        <v-row justify="center" class="mt-5">
          <v-col cols="12" md="5" lg="3">
            <v-select
                label="Hledat dle statusu"
                :items="selectOptions"
                v-model="selectedStatusType"
                variant="outlined"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row v-if="filteredReservations" justify="center">
          <v-col
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
          >
            <v-card class="text-center fill-height">
              <v-card-title class="text-wrap">{{ reservation.vehicleName }}</v-card-title>
              <v-card-item>{{ reservation.startDate }} - {{ reservation.endDate }}</v-card-item>
              <v-card-text>
                Status: {{ reservation.status }}
              </v-card-text>
              <v-card-actions class="justify-center" v-if="reservation.status === StatusTypes.PENDING">
                <v-btn variant="text" color="red" @click="cancelReservation(reservation)">Zrušit</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
