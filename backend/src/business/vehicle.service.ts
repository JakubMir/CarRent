import {loadProto} from "../proto/proto-loader";
import {ReceivedVehicle} from "../types/ReceivedVehicle";

const grpc = require('@grpc/grpc-js');


const vehicleProto = loadProto('vehicle');

const vehicleClient = new vehicleProto.VehicleService(
    process.env.VEHICLE_SERVICE_URL || 'localhost:50051',
    grpc.credentials.createInsecure()
);

export const vehicleService = {
    async getVehicles(): Promise<ReceivedVehicle[]> {
        return new Promise((resolve, reject) => {
            vehicleClient.GetVehicles({}, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (response && response.vehicles) {
                        const vehicles: ReceivedVehicle[] = response.vehicles.map((record: any) => ({
                            id: record.id,
                            make: record.make,
                            model: record.model,
                            year: parseInt(record.year, 10),
                            fuelType: record.fuelType,
                            drive: record.drive,
                        }));
                        resolve(vehicles);
                    } else {
                        reject(new Error("Response does not contain vehicles"));
                    }
                }
            });
        });
    },

    async getVehiclesByMake(make: string): Promise<ReceivedVehicle[]> {
        return new Promise((resolve, reject) => {
            vehicleClient.GetVehicleByMake({ make }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (response && response.vehicles) {
                        const vehicles: ReceivedVehicle[] = response.vehicles.map((record: ReceivedVehicle) => ({
                            id: record.id,
                            make: record.make,
                            model: record.model,
                            year: parseInt(record.year.toString(), 10),
                            fuelType: record.fuelType,
                            drive: record.drive,
                        }));
                        resolve(vehicles);
                    } else {
                        reject(new Error("Response does not contain vehicles"));
                    }
                }
            });
        });
    },

    async getVehiclesByModel(model: string): Promise<ReceivedVehicle[]> {
        return new Promise((resolve, reject) => {
            vehicleClient.GetVehicleByModel({ model }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (response && response.vehicles) {
                        const vehicles: ReceivedVehicle[] = response.vehicles.map((record: ReceivedVehicle) => ({
                            id: record.id,
                            make: record.make,
                            model: record.model,
                            year: parseInt(record.year.toString(), 10),
                            fuelType: record.fuelType,
                            drive: record.drive,
                        }));
                        resolve(vehicles);
                    } else {
                        reject(new Error("Response does not contain vehicles"));
                    }
                }
            });
        });
    },

    async getVehiclesByMakeAndModel(make: string, model: string): Promise<ReceivedVehicle[]> {
        return new Promise((resolve, reject) => {
            vehicleClient.GetVehicleByMakeAndModel({ make, model }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (response && response.vehicles) {
                        const vehicles: ReceivedVehicle[] = response.vehicles.map((record: ReceivedVehicle) => ({
                            id: record.id,
                            make: record.make,
                            model: record.model,
                            year: parseInt(record.year.toString(), 10),
                            fuelType: record.fuelType,
                            drive: record.drive,
                        }));
                        resolve(vehicles);
                    } else {
                        reject(new Error("Response does not contain vehicles"));
                    }
                }
            });
        });
    },
};

