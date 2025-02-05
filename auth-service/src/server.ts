import {authController, authProto} from "./api/auth.controller";
import {Config} from "../config";

const grpc = require('@grpc/grpc-js');

const server = new grpc.Server();

server.addService(
    authProto.AuthService.service,
    authController
);

server.bindAsync('0.0.0.0:' + Config.port, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Auth-service is running on port ${Config.port}`);
});