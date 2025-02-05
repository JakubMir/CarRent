import {Config} from "../config";

import {reservationController, reservationProto} from "./api/reservation.controller";


const grpc = require('@grpc/grpc-js');

// Initialize gRPC server
const server = new grpc.Server();

// Vehicle Service
server.addService(
    reservationProto.ReservationService.service,
    reservationController
);

// Start the gRPC server
server.bindAsync('0.0.0.0:' + Config.port, grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server is running on port ' + Config.port);
});
