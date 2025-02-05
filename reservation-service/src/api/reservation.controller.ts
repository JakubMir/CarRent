import {loadProto} from "../proto/proto-loader";
import {reservationService} from "../business/reservation.service";
import {Reservation} from "../persistence/models/reservation";

export const reservationProto = loadProto('reservation');
export const reservationController = {
    async createReservation(call: any, callback: any) {
        try {
            console.log(`create reservation call: ${JSON.stringify(call.request)}`)
            const reservation = await reservationService.createReservation(call.request);
            console.log(`create reservation result: ${JSON.stringify(reservation)}`)
            callback(null, { reservation });
        } catch (error) {
            console.error(`Create reservation error code: ${error.code}`)
            callback({ code: 500, message: error.message });
        }
    },

    async getReservationsByUser(call: any, callback: any){
        try {
            const { userId } = call.request;
            const reservations = await reservationService.getReservationsByUser(userId);
            callback(null, { reservations });
        } catch (error) {
            console.error(`Get user reservation error code: ${error.code}`)
            callback({ code: 500, message: error.message });
        }
    },

    async getReservationsByVehicle(call: any, callback: any){
        try {
            const { vehicleId } = call.request;
            console.log(`call from controller: ${JSON.stringify(call.request)}`)
            console.log(`vehicle from controller: ${vehicleId}`)
            const reservations = await reservationService.getReservationsByVehicle(vehicleId);
            console.log(JSON.stringify(reservations))
            callback(null, { reservations });
        } catch (error) {
            console.error(`Get vehicle reservation error code: ${error.code}`)
            callback({ code: 500, message: error.message });
        }
    },

    async updateReservation(call: any, callback: any){
        try {
            const { id, ...reservationData } = call.request;
            const updatedReservation = await reservationService.updateReservation(id, reservationData);
            callback(null, { reservation: updatedReservation });
        } catch (error) {
            console.error(`Update reservation error code: ${error.code}`)
            callback({ code: 500, message: error.message });
        }
    },

    async getReservations(call: any, callback: any){
        try {
            const reservations = await reservationService.getReservations();
            callback(null, { reservations });
        } catch (error) {
            console.error(`Get reservations error code: ${error.code}`)
            callback({ code: 500, message: error.message });
        }
    },

    async deleteReservation(call: any, callback: any){
        try {
            const { id } = call.request;
            await reservationService.deleteReservation(id);
            callback(null, { message: "Reservation deleted successfully" });
        } catch (error) {
            console.error(`delete reservations error code: ${error.code}`)
            callback({ code: 500, message: error.message });
        }
    }
}