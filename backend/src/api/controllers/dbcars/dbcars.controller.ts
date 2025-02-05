import express from "express";
import {dbcarsService} from "../../../business/dbcars.service";
import {ReceivedVehicle} from "../../../types/ReceivedVehicle";
import {IdParam} from "../../../types/base.dto";
import {validateBody, validateParams} from "../../../middleware/validation.middleware";
import {AuthDto} from "../auth/auth.dto";
import {DbcarsCreateDto} from "./dbcars.create.dto";

export const dbcarsController = {
    async getAllVehicles(req: express.Request, res: express.Response) {
        try {
            const vehicles = await dbcarsService.getVehicles();
            console.log(`Got vehicles: ${JSON.stringify(vehicles)}`)
            res.status(200).json(vehicles).send();
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            res.status(500).json({ error: "Failed to fetch vehicles" }).send();
        }
    },

    async getVehicleById(req: express.Request, res: express.Response) {
        try {
            const { id } = await validateParams(req, IdParam);
            const vehicle = await dbcarsService.getVehicleById(id);
            console.log(`Got vehicle by id: ${JSON.stringify(vehicle)}`)
            res.status(200).json(vehicle).send();
        } catch (error) {
            console.error("Error fetching vehicle by ID:", error);
            res.status(404).json({ error: "Vehicle not found" }).send();
        }
    },

    async createVehicle(req: express.Request, res: express.Response) {
        try {
            const dto = await validateBody(req, DbcarsCreateDto);
            const newVehicle = await dbcarsService.createVehicle({...dto});
            console.log(`Created vehicle: ${JSON.stringify(newVehicle)}`)
            res.status(201).json(newVehicle).send()
        } catch (error) {
            console.error("Error creating vehicle:", error);
            res.status(500).json({ error: "Failed to create vehicle" }).send();
        }
    },

    async updateVehicle(req: express.Request, res: express.Response) {
        try {
            const { id } = await validateParams(req, IdParam);
            const dto = await validateBody(req, DbcarsCreateDto);
            const updatedVehicle = await dbcarsService.updateVehicle(id, {...dto});
            console.log(`Updated vehicle: ${JSON.stringify(updatedVehicle)}`)
            res.status(200).json(updatedVehicle).send();
        } catch (error) {
            console.error("Error updating vehicle:", error);
            res.status(500).json({ error: "Failed to update vehicle" }).send();
        }
    },

    async deleteVehicle(req: express.Request, res: express.Response) {
        try {
            const { id } = await validateParams(req, IdParam);
            await dbcarsService.deleteVehicle(id);
            console.log(`Deleted vehicle`)
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            res.status(500).json({ error: "Failed to delete vehicle" }).send();
        }
    },
};