import {loadProto} from "../proto/proto-loader";
import {Reservation} from "../persistence/models/reservation";
import {notificationService} from "./notification.service";

const grpc = require('@grpc/grpc-js');


const reservationProto = loadProto('reservation');

const reservationClient = new reservationProto.ReservationService(
    process.env.RESERVATION_SERVICE_URL || 'localhost:50053',
    grpc.credentials.createInsecure()
);

export const reservationService = {
    async createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation>{
        return new Promise((resolve, reject) => {
            reservationClient.createReservation(reservation, async (error: any, response: any) => {
                if (error) {
                    console.error('gRPC Error:', error.message);
                    reject(new Error('Failed to create reservation: ' + error.message));
                } else {
                    resolve(response.reservation)
                }
            });
        });
    },

    async getReservationsByUser(userId: string): Promise<Reservation[]> {
        return new Promise((resolve, reject) => {
            reservationClient.getReservationsByUser({ userId }, (error: any, response: any) => {
                if (error) {
                    console.error('gRPC Error:', error.message);
                    reject(new Error('Failed to fetch reservations: ' + error.message));
                } else {
                    resolve(response.reservations || []);
                }
            });
        });
    },

    async getReservationsByVehicle(vehicleId: string): Promise<Reservation[]> {
        return new Promise((resolve, reject) => {
            console.log(`vehicle id from service: ${vehicleId}`)
            reservationClient.getReservationsByVehicle({ vehicleId }, (error: any, response: any) => {
                if (error) {
                    console.error('gRPC Error:', error.message);
                    reject(new Error('Failed to fetch vehicle reservations: ' + error.message));
                } else {
                    resolve(response.reservations || []);
                }
            });
        });
    },

    async updateReservation(id: string, reservation: Partial<Reservation>): Promise<Reservation> {
        return new Promise((resolve, reject) => {
            reservationClient.updateReservation({ id, ...reservation }, (error: any, response: any) => {
                if (error) {
                    console.error('gRPC Error:', error.message);
                    reject(new Error('Failed to update reservation: ' + error.message));
                } else {
                    console.log("reservation updated")
                    notificationService.notifyUser(reservation.userId, `Vaše rezervace ${reservation.vehicleName} má nový status: ${reservation.status}`)
                    resolve(response.reservation);
                }
            });
        });
    },

    async getReservations(): Promise<Reservation[]> {
        return new Promise((resolve, reject) => {
            reservationClient.getReservations({}, (error: any, response: any) => {
                if (error) {
                    console.error('gRPC Error:', error.message);
                    reject(new Error('Failed to fetch reservations: ' + error.message));
                } else {
                    resolve(response.reservations || []);
                }
            });
        });
    },

    async deleteReservation(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            reservationClient.deleteReservation({id}, (error: any, response: any) => {
                if (error) {
                    console.error('gRPC Error:', error.message);
                    reject(new Error('Failed to delete reservation: ' + error.message));
                } else {
                    resolve();
                }
            });
        });
    }
}