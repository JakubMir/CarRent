import type {ApiVehicle} from "@/model/ApiVehicle";
import {ref} from "vue";
import Config from "@/config";
import axios from 'axios';
import type {Vehicle} from "@/model/Vehicle";
import {useAuthService} from "@/composables/useAuthService";

export function useDbCars(){
    const vehicles = ref<ApiVehicle[]>([]);
    const singleVehicle = ref<ApiVehicle>({_id: "", drive: "", fuelType: "", id: "", make: "", model: "", year: 0});
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchVehicles() {
        loading.value = true;
        error.value = null;

        let url = `${Config.backendUrl}/db-cars`;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            vehicles.value = response.data;

        } catch (err: any) {
            error.value = err.message || 'An error occurred';
        } finally {
            loading.value = false;
        }
    }

    async function fetchVehicleById(id: string) {
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/db-cars/${id}`;

        try {
            const response = await axios.get(url);
            singleVehicle.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'Nepovedlo se načíst detail vozidla';
        } finally {
            loading.value = false;
        }
    }

    async function addVehicle(newVehicle: ApiVehicle) {
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/db-cars`;
        const { _id, ...vehicleWithoutId } = newVehicle;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(url, vehicleWithoutId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

        } catch (err: any) {
            error.value = err.message || 'An error occurred';
            useAuthService().logout()
        } finally {
            loading.value = false;
        }
    }

    async function updateVehicle(vehicle: Vehicle) {
        const url = `${Config.backendUrl}/db-cars/${vehicle.id}`;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(url, vehicle, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

        } catch (err: any) {
            console.error("Error updating vehicle:", err.message);
            error.value = err.message || 'An error occurred';
            useAuthService().logout()
        }
    }


    async function deleteVehicle(vehicleId: string){
        const url = `${Config.backendUrl}/db-cars/${vehicleId}`;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

        } catch (err: any) {
            error.value = err.message || 'An error occurred';
            useAuthService().logout()
        }
    }


    return {
        vehicles,
        singleVehicle,
        loading,
        error,
        fetchVehicles,
        fetchVehicleById,
        addVehicle,
        updateVehicle,
        deleteVehicle
    };
}
