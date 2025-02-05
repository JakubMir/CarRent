<script lang="ts" setup>
import {computed, onBeforeMount, reactive, ref} from "vue"
import {useVehicleService} from "@/composables/useVehicleService"
import type {ApiVehicle} from "@/model/ApiVehicle"
import {useDbCars} from "@/composables/useDbCars"
import type {Vehicle} from "@/model/Vehicle"

const vehicleService = useVehicleService()
const dbCars = useDbCars()

const apiVehicles = ref<Array<ApiVehicle>>([])
const dbVehicles = ref<Array<ApiVehicle>>([])

const apiSearchMake = ref("")
const apiSearchModel = ref("")

const dbSearchMake = ref("")
const dbSearchModel = ref("")

const filteredVehicles = computed(() => {
  return dbVehicles.value.filter((vehicle) => {
    const matchesMake = dbSearchMake.value
        ? vehicle.make.toLowerCase().includes(dbSearchMake.value.toLowerCase())
        : true
    const matchesModel = dbSearchModel.value
        ? vehicle.model.toLowerCase().includes(dbSearchModel.value.toLowerCase())
        : true

    return matchesMake && matchesModel
  })
})

const apiVehicleHeaders = [
  {title: "Výrobce", value: "make", sortable: true},
  {title: "Model", value: "model", sortable: true},
  {title: "Rok", value: "year", sortable: true},
  {title: "Palivo", value: "fuelType", sortable: true},
  {title: "Pohon", value: "drive", sortable: true},
  {title: "Akce", value: "actions", sortable: false},
]

const newVehicle = ref({
  _id: '',
  make: '',
  model: '',
  year: 0,
  fuelType: '',
  drive: '',
})

const submitVehicle = async () => {
  if (newVehicle.value.make && newVehicle.value.model) {
    try {
      await dbCars.addVehicle(newVehicle.value)
      await fetchDbData()
      resetForm()
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Nastala chyba při přidávání vozidla.')
    }
  } else {
    alert('Prosím vyplňte všechny povinné údaje.')
  }
}

const resetForm = () => {
  newVehicle.value = {_id: '', make: '', model: '', year: 0, fuelType: '', drive: ''}
}

async function searchVehicles() {
  await fetchData(apiSearchMake.value, apiSearchModel.value)
}

async function fetchData(make: string = '', model: string = '') {
  try {
    await vehicleService.fetchVehicles({make, model})
    apiVehicles.value = [...vehicleService.vehicles.value]
  } catch (error) {
    console.error('Error fetching vehicles:', error)
  }
}

async function fetchDbData() {
  try {
    await dbCars.fetchVehicles()
    dbVehicles.value = [...dbCars.vehicles.value]
  } catch (error) {
    console.error('Error fetching db vehicles:', error)
  }
}


onBeforeMount(async () => {
  await Promise.all([fetchData(), fetchDbData()])
})


const addVehicle = async (vehicle: any) => {
  const {id, ...vehicleWithoutId} = vehicle

  await dbCars.addVehicle(vehicleWithoutId)
  await fetchDbData()

}

const editDialog = ref(false)
const selectedVehicle = reactive<Vehicle>({id: "", drive: "", fuelType: "", make: "", model: "", year: 0})

const openEditDialog = (vehicle: Vehicle | ApiVehicle) => {
  Object.assign(selectedVehicle, vehicle)
  editDialog.value = true
}

const closeEditDialog = () => {
  selectedVehicle.id = ""
  selectedVehicle.drive = ""
  selectedVehicle.fuelType = ""
  selectedVehicle.make = ""
  selectedVehicle.model = ""
  selectedVehicle.year = 0

  editDialog.value = false
}


const saveChanges = async () => {
  try {
    await dbCars.updateVehicle(selectedVehicle)
    await fetchDbData()
    closeEditDialog()
  } catch (error) {
    console.error('Error saving changes:', error)
  }
}

const deleteVehicle = async (vehicle: any) => {
  await dbCars.deleteVehicle(vehicle.id)
  await fetchDbData()
}
</script>

<template>
  <v-container class="py-6">
    <!-- Current vehicles -->
    <v-card class="mb-6 text-center">
      <v-card-title>
        <v-row>
          <v-col class="text-h4 mt-4" cols="12">Aktuální vozidla</v-col>
          <v-col cols="12" md="6">
            <v-text-field
                v-model="dbSearchMake"
                class="mx-sm-10"
                hide-details
                label="Hledat vozidla dle výrobce"
                variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
                v-model="dbSearchModel"
                class="mx-sm-10"
                hide-details
                label="Hledat vozidla dle modelu"
                variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
          :headers="apiVehicleHeaders"
          :items="filteredVehicles"
          :loading="dbCars.loading.value"
          class="elevation-1"
          item-value="id"
      >
        <template v-slot:headers="{ columns, getSortIcon, toggleSort }">
          <tr>
            <template v-for="(column, index) in columns" :key="column.key">
              <th class="text-center">
                <span :class="index !== columns.length-1 ? 'cursor-pointer' : ''" class="mr-2"
                      @click="index !== columns.length-1 ? toggleSort(column) : null">
                  {{ column.title }}
                  <v-icon v-if="index !== columns.length-1" :icon="getSortIcon(column)"></v-icon>
                </span>
              </th>
            </template>
          </tr>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <template v-slot:no-data>
          Žádná vozidla k dispozici
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" variant="text" @click="openEditDialog(item)">Upravit</v-btn>
          <v-btn color="red" variant="text" @click="deleteVehicle(item)">Smazat</v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="editDialog" class="w-100 w-md-50">
      <v-card>
        <v-card-title class="text-center">
          <span class="text-h6">Upravit vozidlo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-for="header in apiVehicleHeaders" :key="header.value" cols="12" sm="6">
                <v-text-field
                    v-if="header.value !== 'actions' && header.value in selectedVehicle"
                    v-model="selectedVehicle[header.value as keyof Vehicle]"
                    :label="header.title"
                    hide-details
                    variant="outlined"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" variant="text" @click="saveChanges">Uložit</v-btn>
          <v-btn color="grey" variant="text" @click="closeEditDialog">Zrušit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Search vehicles from API -->
    <v-card class="mb-6 text-center">
      <v-card-title>
        <v-row class="align-center justify-space-between">
          <v-col class="text-h4 mt-4" cols="12">Vyhledat externí vozidla</v-col>
          <v-col cols="12" md="5">
            <v-text-field
                v-model="apiSearchMake"
                class="mx-sm-10"
                hide-details
                label="Hledat vozidla dle výrobce"
                variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
                v-model="apiSearchModel"
                class="mx-sm-10"
                hide-details
                label="Hledat vozidla dle modelu"
                variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn class="w-100 w-sm-75" color="blue" @click="searchVehicles">Hledat</v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
          :headers="apiVehicleHeaders"
          :items="apiVehicles"
          :loading="vehicleService.loading.value"
          class="elevation-1"
          item-value="id"
      >
        <template v-slot:headers="{ columns, getSortIcon, toggleSort }">
          <tr>
            <template v-for="(column, index) in columns" :key="column.key">
              <th class="text-center">
                <span :class="index !== columns.length-1 ? 'cursor-pointer' : ''" class="mr-2"
                      @click="toggleSort(column)">
                  {{ column.title }}
                  <v-icon v-if="index !== columns.length-1" :icon="getSortIcon(column)"/>
                </span>
              </th>
            </template>
          </tr>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <template v-slot:no-data>
          Žádná vozidla k dispozici
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="green" variant="text" @click="addVehicle(item)">Přidat</v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add new vehicle -->
    <v-card class="text-center py-5">
      <v-card-title>
        <v-row justify="center">
          <v-col class="text-h4 pb-5" cols="12">Přidat nové vozidlo</v-col>
          <v-col cols="12" sm="5">
            <v-text-field
                v-model="newVehicle.make"
                label="Výrobce"
                required
                variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
                v-model="newVehicle.model"
                label="Model"
                variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5">
            <v-number-input
                v-model="newVehicle.year"
                :max="new Date().getFullYear()"
                :min="1980"
                control-variant="stacked"
                inset
                label="Rok"
                type="number"
                variant="outlined"
            >
            </v-number-input>
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
                v-model="newVehicle.fuelType"
                label="Palivo"
                variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
                v-model="newVehicle.drive"
                label="Pohon"
                variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn class="mt-3 w-100 w-sm-75 w-md-25" color="green" @click="submitVehicle">Přidat vozidlo</v-btn>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<style scoped>
</style>
