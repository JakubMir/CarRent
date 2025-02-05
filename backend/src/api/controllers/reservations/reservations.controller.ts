import { Request, Response } from 'express';
import {reservationService} from "../../../business/reservations.service";
import {authService} from "../../../business/auth.service";
import {dbcarsController} from "../dbcars/dbcars.controller";
import {dbcarsService} from "../../../business/dbcars.service";
import {Reservation} from "../../../persistence/models/reservation";
import {IdParam, UidParam} from "../../../types/base.dto";
import {validateParams} from "../../../middleware/validation.middleware";

export const reservationController = {
    async createReservation(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split('Bearer ')[1];
            const user = await authService.verifyToken(token)
            const reservationData: Reservation = req.body;
            reservationData.userId = user.userId
            reservationData.email = user.email

            const vehicle = await dbcarsService.getVehicleById(reservationData.vehicleId)
            reservationData.vehicleName = `${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.drive} ${vehicle.fuelType}`

            console.log(`create reservation data: ${JSON.stringify(reservationData)}`)
            const reservation = await reservationService.createReservation(reservationData);
            res.status(201).json(reservation).send();
        } catch (error: any) {
            console.error('Error in createReservation:', error.message);
            res.status(500).json({ error: error.message }).send();
        }
    },

    async getReservationsByUser(req: Request, res: Response) {
        try {
            console.log(`params: ${JSON.stringify(req.params)}`)
            console.log(`uid: ${req.params.userId}`)
            console.log(`uid len: ${req.params.userId.length}`)
            const {userId} = await validateParams(req, UidParam);

            const reservations = await reservationService.getReservationsByUser(userId);
            res.status(200).json(reservations).send();
        } catch (error: any) {
            console.error('Error in getReservationsByUser:', error.message);
            res.status(500).json({ error: error.message }).send();
        }
    },

    async getReservationsByVehicle(req: Request, res: Response) {
        try {
            const {id} = await validateParams(req, IdParam);
            const reservations = await reservationService.getReservationsByVehicle(id);
            console.log(`reservations: ${JSON.stringify(reservations)}`)
            res.status(200).json(reservations).send();
        } catch (error: any) {
            console.error('Error in getReservationsByVehicle:', error.message);
            res.status(500).json({ error: error.message }).send();
        }
    },

    async updateReservation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const reservationData = req.body;
            const updatedReservation = await reservationService.updateReservation(id, reservationData);
            res.status(200).json(updatedReservation).send();
        } catch (error: any) {
            console.error('Error in updateReservation:', error.message);
            res.status(500).json({ error: error.message });
        }
    },

    async getReservations(req: Request, res: Response) {
        try {
            const reservations = await reservationService.getReservations();
            res.status(200).json(reservations).send();
        } catch (error: any) {
            console.error('Error in getReservations:', error.message);
            res.status(500).json({ error: error.message }).send();
        }
    },

    async deleteReservation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await reservationService.deleteReservation(id);
            console.log(`Reservation with id ${id} deleted successfully.`);
            res.status(204).send();
        } catch (error) {
            console.error(`Error deleting reservation: ${error.message}`);
            res.status(500).json({ message: `Error deleting reservation: ${error.message}` }).send();
        }
    }

};
