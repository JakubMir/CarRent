import {vehicleService} from "../../../business/vehicle.service";
import express = require('express');
import {ReceivedVehicle} from "../../../types/ReceivedVehicle";

export const vehicleController = {
    async allApiVehicles(req: express.Request, res: express.Response) {
        try {
            const { make, model } = req.query;

            let vehicles: ReceivedVehicle[];
            if (make && model) {
                vehicles = await vehicleService.getVehiclesByMakeAndModel(make as string, model as string);
            } else if (make) {
                vehicles = await vehicleService.getVehiclesByMake(make as string);
            } else if (model) {
                vehicles = await vehicleService.getVehiclesByModel(model as string);
            } else {
                vehicles = await vehicleService.getVehicles();
            }

            res.status(200).send(vehicles);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            res.status(500).json({ error: 'Failed to fetch vehicles' }).send();
        }
    },
}