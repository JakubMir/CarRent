import { fetchVehicles, fetchVehiclesByMake, fetchVehiclesByModel, fetchVehiclesByMakeAndModel } from '../business/vehicle.service';
import { loadProto } from "../proto/proto-loader";

export const vehicleProto = loadProto('vehicle');

export const vehicleController = {
    GetVehicles: async (_: any, callback: any) => {
        try {
            const vehicles = await fetchVehicles();
            callback(null, { vehicles });
        } catch (error) {
            callback(error, null);
        }
    },
    GetVehicleByMake: async (call: any, callback: any) => {
        try {
            const make = call.request.make;
            const vehicles = await fetchVehiclesByMake(make);
            callback(null, { vehicles });
        } catch (error) {
            callback(error, null);
        }
    },
    GetVehicleByModel: async (call: any, callback: any) => {
        try {
            const model = call.request.model;
            const vehicles = await fetchVehiclesByModel(model);
            callback(null, { vehicles });
        } catch (error) {
            callback(error, null);
        }
    },
    GetVehicleByMakeAndModel: async (call: any, callback: any) => {
        try {
            const { make, model } = call.request;
            const vehicles = await fetchVehiclesByMakeAndModel(make, model);
            callback(null, { vehicles });
        } catch (error) {
            callback(error, null);
        }
    },
};
