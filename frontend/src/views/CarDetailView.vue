<script lang="ts" setup>
import {computed, onBeforeMount, ref, watch} from 'vue'
import {useDbCars} from '@/composables/useDbCars'
import Loading from '@/components/Loading.vue'
import Error from '@/components/Error.vue'
import type {ApiVehicle} from "@/model/ApiVehicle"
import {useReservationService} from "@/composables/useReservationService"
import type {Reservation} from "@/model/Reservation"
import {StatusTypes} from "@/model/StatusTypes"
import {formatDate, getFormattedISO, getTomorrowDate, parseDate, sortDateRanges} from "@/utils/dateUtils";

const props = defineProps({
  id: String
})

const dbCars = useDbCars()

const reservationService = useReservationService()

const vehicle = ref<ApiVehicle>({
  id: '',
  make: '',
  model: '',
  year: 0,
  fuelType: '',
  drive: '',
})

const carReservations = ref<Array<Reservation>>([])

const minDate = ref(new Date())

const reservationRange = ref([
  new Date(),
  new Date()
])


watch(reservationRange, (newVal) => {
  reservation.value.startDate = `${newVal[0].getMonth() + 1}/${newVal[0].getDate()}/${newVal[0].getFullYear()}`

  const lastIndex = newVal.length - 1
  reservation.value.endDate = `${newVal[lastIndex].getMonth() + 1}/${newVal[lastIndex].getDate()}/${newVal[lastIndex].getFullYear()}`
})

watch(minDate, (newVal) => {
  reservation.value.startDate = newVal.toString()
  reservation.value.endDate = newVal.toString()
})


const isAllowedDate = (date: any) => {
  const currentDate = new Date(date)
  const time = currentDate.getTime()
  return !carReservations.value.some(reservation => {
    if (reservation.status === StatusTypes.APPROVED || reservation.status === StatusTypes.PENDING) {
      const start = new Date(reservation.startDate).getTime()
      const end = new Date(reservation.endDate).getTime()
      return time >= start && time <= end
    } else {
      return false
    }
  })
}

const reservation = ref<Reservation>({
  id: "",
  startDate: getFormattedISO(reservationRange.value[0]),
  endDate: getFormattedISO(reservationRange.value[reservationRange.value.length - 1]),
  status: "",
  userId: "",
  email: "",
  vehicleId: <string>props.id,
  vehicleName: "",
})

const error = ref<string | null>(null)
const loading = ref(false)
const success = ref(false)

const isEnabled = computed(() => {
  let allValid = true
  reservationRange.value.forEach((res) => {
    if (!isAllowedDate(res)) {
      allValid = false
      return
    }
  })
  return allValid
})

async function fetchVehicle() {
  try {
    await dbCars.fetchVehicleById(<string>props.id)
    await reservationService.getReservationsByVehicle(<string>props.id)
    vehicle.value = dbCars.singleVehicle.value
    carReservations.value = reservationService.reservations.value
  } catch (err: any) {
    error.value = err.message || 'Nepovedlo se načíst detail vozu'
    console.error(err.message)
  }
}

async function reserveCar() {
  loading.value = true
  try {
    await reservationService.createReservation(reservation.value)
    success.value = true
    await reservationService.getReservationsByVehicle(<string>props.id)
    carReservations.value = reservationService.reservations.value.reverse()
  } catch (error) {
    console.error('Error adding vehicle:', error)
    alert('Nastala chyba při rezervaci vozidla')
  } finally {
    loading.value = false
    const freeDate = findFirstAvailableDate(carReservations.value)
    reservationRange.value = [new Date(freeDate), new Date(freeDate)]
  }
}

function findFirstAvailableDate(dateRange: Reservation[]): string {
  const tomorrow = getTomorrowDate()

  if (dateRange.length === 0) {
    return formatDate(tomorrow)
  }

  const filteredRanges = dateRange.filter((r) => {
    return (r.status === StatusTypes.APPROVED || r.status === StatusTypes.PENDING)
  }).map((r)=>({
    startDate: parseDate(r.startDate),
    endDate: parseDate(r.endDate)
  }))

  const sortedRanges = sortDateRanges(filteredRanges)

  for (let i = 0; i < sortedRanges.length - 1; i++) {
    const currentEnd = sortedRanges[i].endDate
    const nextStart = sortedRanges[i + 1].startDate

    const dayAfterCurrentEnd = currentEnd
    dayAfterCurrentEnd.setDate(currentEnd.getDate() + 1)

    if (dayAfterCurrentEnd < nextStart) {
      if (dayAfterCurrentEnd >= tomorrow) return formatDate(dayAfterCurrentEnd)
      if (nextStart >= tomorrow) return formatDate(tomorrow)
    }
  }

  const lastEndDate = sortedRanges[sortedRanges.length - 1].endDate

  const dayAfterLastEnd = new Date(lastEndDate)
  dayAfterLastEnd.setDate(lastEndDate.getDate() + 1)

  return lastEndDate <= tomorrow ? formatDate(tomorrow) : formatDate(dayAfterLastEnd)
}

onBeforeMount(() => {
  fetchVehicle().then(() => {
    const freeDate = findFirstAvailableDate(carReservations.value)
    reservationRange.value = [new Date(freeDate), new Date(freeDate)]
  })
})
</script>

<template>
  <v-container>
    <v-col v-if="reservationService.loading.value" class="text-center" cols="12">
      <Loading/>
    </v-col>
    <Error v-else-if="dbCars.error.value || reservationService.error.value"
           :message="'Nepovedlo se načíst detail vozidla :('"/>
    <v-row v-else-if="(!dbCars.error.value) && (!reservationService.error.value) && (!dbCars.loading.value)">
      <v-col class="text-center" cols="12">
        <h1 v-if="success" class="text-h2 font-weight-bold text-green mb-2">Rezervace vytvořena</h1>
        <h1 class="text-h3 font-weight-bold">{{ vehicle.make }} {{ vehicle.model }}</h1>
        <h2 class="text-h3">{{ vehicle.year }}</h2>
        <div class="my-8">
          <h1 class="text-h4">Palivo: {{ vehicle.fuelType }}</h1>
          <h1 class="text-h4">Pohon: {{ vehicle.drive || "Neuvedeno" }}</h1>
        </div>
        <v-row class="justify-center">
          <v-date-input
              v-model="reservationRange"
              :allowed-dates="isAllowedDate"
              :first-day-of-week="1"
              :min="minDate"
              label="Vyberte rozmezí"
              max-width="328"
              multiple="range"
              prepend-icon=""
              required
          ></v-date-input>
        </v-row>
        <v-btn :disabled="!isEnabled" class="mt-3" color="primary" variant="flat" @click="reserveCar">
          <template v-if="loading">
            <v-progress-circular
                color="white"
                indeterminate
                size="24"
            ></v-progress-circular>
          </template>
          <template v-else>
            Rezervovat
          </template>
        </v-btn>

        <h3 class="mt-5">PLATBA PŘI PŘEDÁNÍ</h3>
      </v-col>
    </v-row>
  </v-container>
</template>
