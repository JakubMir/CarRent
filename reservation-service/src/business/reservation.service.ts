import {Reservation} from "../persistence/models/reservation";
import {firestore} from "../config/firebase";
import {StatusTypes} from "../types/StatusTypes";


export const reservationService = {
    async createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation> {
        try {
            reservation.status = StatusTypes.PENDING
            const docRef = await firestore.collection("reservations").add(reservation);
            await docRef.set({id: docRef.id,...reservation})
            return { id: docRef.id, ...reservation };
        } catch (error) {
            throw new Error(`Error creating reservation: ${error.message}`);
        }
    },

    async getReservationsByUser(userId: string): Promise<Reservation[]> {
        try {
            console.log(`user: ${userId}`)
            const snapshot = await firestore
                .collection("reservations")
                .where("userId", "==", userId)
                .get();

            return snapshot.docs.map((doc) => doc.data()) as Reservation[];
        } catch (error) {
            throw new Error(`Error fetching reservations for user: ${error.message}`);
        }
    },

    async getReservationsByVehicle(vehicleId: string): Promise<Reservation[]> {
        try {
            console.log(`vehicle: ${vehicleId}`)
            const snapshot = await firestore
                .collection("reservations")
                .where("vehicleId", "==", vehicleId)
                .get();
            console.log(`Snap: ${snapshot.docs}`)

            return snapshot.docs.map((doc) => doc.data()) as Reservation[];
        } catch (error) {
            throw new Error(`Error fetching reservations for vehicle: ${error.message}`);
        }
    },

    async updateReservation(id: string, reservation: Partial<Reservation>): Promise<Reservation> {
        try {
            const reservationRef = firestore.collection("reservations").doc(id);
            const docSnapshot = await reservationRef.get();

            if (!docSnapshot.exists) {
                throw new Error("Reservation not found");
            }

            await reservationRef.update(reservation);

            const updatedDoc = await reservationRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() } as Reservation;
        } catch (error) {
            throw new Error(`Error updating user reservation: ${error.message}`);
        }
    },

    async getReservations(): Promise<Reservation[]> {
        try {
            const snapshot = await firestore.collection("reservations").get();

            return snapshot.docs.map((doc) => doc.data()) as Reservation[];
        } catch (error) {
            throw new Error(`Error fetching reservations: ${error.message}`);
        }
    },

    async deleteReservation(id: string):Promise<void>{
        try {
            console.log(`delete reservation id: ${id}`)
            await firestore.collection("reservations").doc(id).delete();
        } catch (error) {
            throw new Error(`Error deleting reservation: ${error.message}`);
        }
    }
}
