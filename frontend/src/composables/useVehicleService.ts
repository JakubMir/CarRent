import type {ApiVehicle} from "@/model/ApiVehicle";
import {ref} from "vue";
import Config from "@/config";

export function useVehicleService() {
  const vehicles = ref<ApiVehicle[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Filter vehícles by make and model
  async function fetchVehicles(filters?: { make?: string; model?: string }) {
    loading.value = true;
    error.value = null;

    // Build URL with params
    let url = `${Config.backendUrl}/vehicles`;
    if (filters?.make || filters?.model) {
      const queryParams = new URLSearchParams();
      if (filters?.make) {
        queryParams.append('make', filters.make);
      }
      if (filters?.model) {
        queryParams.append('model', filters.model);
      }
      url += `?${queryParams.toString()}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return new Error(`Failed to fetch vehicles: ${response.statusText}`);
      }

      vehicles.value = await response.json();

    } catch (err: any) {
      error.value = err.message || 'An error occurred';
    } finally {
      loading.value = false;
    }
  }

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
  };
}
