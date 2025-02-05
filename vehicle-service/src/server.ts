import {Config} from "../config";
import {vehicleController, vehicleProto} from "./api/vehicle.controller";


const grpc = require('@grpc/grpc-js');

// Initialize gRPC server
const server = new grpc.Server();

// Vehicle Service
server.addService(
    vehicleProto.VehicleService.service,
    vehicleController
);

// Start the gRPC server
server.bindAsync('0.0.0.0:' + Config.port, grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server is running on port ' + Config.port);
});
