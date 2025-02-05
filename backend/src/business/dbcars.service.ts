import {ReceivedVehicle} from "../types/ReceivedVehicle";
import {firestore} from "../config/firebase";

export const dbcarsService = {
    async getVehicles(): Promise<ReceivedVehicle[]> {
        try {
            const snapshot = await firestore.collection("vehicles").get();
            const vehicles: ReceivedVehicle[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ReceivedVehicle[];
            return vehicles;
        } catch (error) {
            throw new Error(`Error fetching vehicles: ${error.message}`);
        }
    },

    async getVehicleById(id: string): Promise<ReceivedVehicle> {
        try {
            const doc = await firestore.collection("vehicles").doc(id).get();
            if (!doc.exists) {
                throw new Error("Vehicle not found");
            }
            return { id: doc.id, ...doc.data() } as ReceivedVehicle;
        } catch (error) {
            throw new Error(`Error fetching vehicle by ID: ${error.message}`);
        }
    },

    async createVehicle(vehicle: Omit<ReceivedVehicle, "id">): Promise<ReceivedVehicle> {
        try {
            const docRef = await firestore.collection("vehicles").add(vehicle);
            await docRef.set({id: docRef.id, ...vehicle})
            return { id: docRef.id, ...vehicle };
        } catch (error) {
            throw new Error(`Error creating vehicle: ${error.message}`);
        }
    },

    async updateVehicle(id: string, vehicle: Partial<ReceivedVehicle>): Promise<ReceivedVehicle> {
        try {
            await firestore.collection("vehicles").doc(id).update(vehicle);
            const updatedDoc = await firestore.collection("vehicles").doc(id).get();
            return { id: updatedDoc.id, ...updatedDoc.data() } as ReceivedVehicle;
        } catch (error) {
            throw new Error(`Error updating vehicle: ${error.message}`);
        }
    },

    async deleteVehicle(id: string): Promise<void> {
        try {
            console.log(`delete vehicle id: ${id}`)
            await firestore.collection("vehicles").doc(id).delete();
        } catch (error) {
            throw new Error(`Error deleting vehicle: ${error.message}`);
        }
    },
};