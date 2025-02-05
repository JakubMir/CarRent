<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import type {ApiVehicle} from "@/model/ApiVehicle";
import Loading from "@/components/Loading.vue";
import Error from "@/components/Error.vue";
import {useDbCars} from "@/composables/useDbCars";

const dbCars = useDbCars()

const vehicles = ref<Array<ApiVehicle>>([])
async function fetchData() {
  try {
    await dbCars.fetchVehicles()
    vehicles.value = dbCars.vehicles.value.map((v) => ({
      ...v,
      _id: v.id,
    })).sort((a, b)=>{
      const makeComparison = a.make.localeCompare(b.make)
      if (makeComparison === 0) {
        return a.model.localeCompare(b.model)
      }
      return makeComparison
    })
  } catch (error) {
    console.error('Error fetching db vehicles:', error)
  }
}

onBeforeMount(async () => {
  await fetchData()
})
</script>

<template>
  <v-container>
    <v-col cols="12" class="text-center" v-if="dbCars.loading.value">
      <Loading />
    </v-col>
    <Error v-else-if="dbCars.error.value" :message="'Nepovedlo se načíst vozidla :('" />
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <h1 class="text-h2 font-weight-bold">Naše vozidla</h1>
      </v-col>

      <v-col v-if="vehicles.length===0" cols="12" class="text-center">
        <h1 class="text-h4">Žádná vozidla k dispozici :(</h1>
      </v-col>

      <v-col
          v-else
          v-for="vehicle in vehicles"
          :key="vehicle._id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card class="fill-height d-flex flex-column">
          <v-card-title class="text-pre-wrap">{{ vehicle.make }} {{ vehicle.model }}</v-card-title>
          <v-card-subtitle class="text-body-1">{{ vehicle.year }}</v-card-subtitle>
          <v-card-text class="text-body-1">
            Palivo: {{ vehicle.fuelType }}<br>
            Pohon: {{ vehicle.drive || "Neuvedeno" }}
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-btn variant="text" color="primary" :to="{ name: 'Car-detail', params: {id: vehicle._id} }">
              Rezervovat
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>

</style>
