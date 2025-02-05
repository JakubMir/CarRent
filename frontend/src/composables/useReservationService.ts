import { ref } from "vue";
import type { Reservation } from "@/model/Reservation";
import Config from "@/config";
import axios from "axios";
import { useAuthService } from "@/composables/useAuthService";

export function useReservationService() {
    const reservations = ref<Reservation[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const auth = useAuthService()

    async function createReservation(reservation: Reservation) {
        auth.checkAuthStatus()
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/reservations`;

        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(url, reservation, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

        } catch (err: any) {
            error.value = err.message || "An error occurred";
            useAuthService().logout();
        } finally {
            loading.value = false;
        }
    }

    async function getReservationsByUser() {
        auth.checkAuthStatus()
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/reservations/${useAuthService().state.user.user_id}`;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            reservations.value = response.data
        } catch (err: any) {
            error.value = err.message || "An error occurred";
        } finally {
            loading.value = false;
        }
    }

    async function getReservationsByVehicle(vehicleId: string) {
        auth.checkAuthStatus()
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/reservations/vehicle/${vehicleId}`;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            reservations.value = response.data
        } catch (err: any) {
            error.value = err.message || "An error occurred";
        } finally {
            loading.value = false;
        }
    }

    async function updateReservation(reservation: Reservation) {
        auth.checkAuthStatus()
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/reservations/${reservation.id}`;

        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(url, reservation, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err: any) {
            error.value = err.message || "An error occurred";
        } finally {
            loading.value = false;
        }
    }

    async function getReservations() {
        auth.checkAuthStatus()
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/admin-reservations`;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            reservations.value = response.data;
        } catch (err: any) {
            error.value = err.message || "An error occurred";
        } finally {
            loading.value = false;
        }
    }

    async function deleteReservation(id: string) {
        auth.checkAuthStatus()
        loading.value = true;
        error.value = null;

        const url = `${Config.backendUrl}/reservations/${id}`;

        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err: any) {
            error.value = err.message || "An error occurred";
        } finally {
            loading.value = false;
        }
    }

    return {
        reservations,
        loading,
        error,
        createReservation,
        getReservationsByUser,
        getReservationsByVehicle,
        updateReservation,
        getReservations,
        deleteReservation,
    };
}
