import express = require('express');
import cors = require('cors');
import {homepageController} from "./controllers/homepage/homepage.controller";
import {vehicleController} from "./controllers/vehicles/vehicle.controller";
import {authController} from "./controllers/auth/auth.controller";
import {dbcarsController} from "./controllers/dbcars/dbcars.controller";
import {checkAuth, hasAnyRole} from "../middleware/auth.middleware";
import {UserRoles} from "../types/UserRoles";
import {reservationController} from "./controllers/reservations/reservations.controller";


export const server = express()

// Allow CORS for process.env.CORS_ORIGIN
server.use(cors({
    origin: process.env.CORS_ORIGIN
}))
console.log('Allowed CORS for', process.env.CORS_ORIGIN)

// Middleware to parse JSON and URL-encoded data
server.use(express.json());
server.use(express.urlencoded({extended: true}))

// --- ROUTES ---

// Homepage
server.get('/', homepageController.homepage)

// Vehicles
server.get('/vehicles', vehicleController.allApiVehicles);

// Auth
server.post('/login', authController.loginUser);
server.post('/register', authController.registerUser);

// DB vehicles
server.get('/db-cars', dbcarsController.getAllVehicles)
server.get("/db-cars/:id", dbcarsController.getVehicleById);
server.post("/db-cars", [checkAuth, hasAnyRole(UserRoles.ADMIN)], dbcarsController.createVehicle);
server.put("/db-cars/:id", [checkAuth, hasAnyRole(UserRoles.ADMIN)], dbcarsController.updateVehicle);
server.delete("/db-cars/:id", [checkAuth, hasAnyRole(UserRoles.ADMIN)], dbcarsController.deleteVehicle);

// Reservations
server.post('/reservations', [checkAuth, hasAnyRole(UserRoles.ADMIN, UserRoles.USER)], reservationController.createReservation)
server.get('/reservations/:userId', [checkAuth, hasAnyRole(UserRoles.ADMIN, UserRoles.USER)], reservationController.getReservationsByUser)
server.get('/reservations/vehicle/:id', [checkAuth, hasAnyRole(UserRoles.ADMIN, UserRoles.USER)], reservationController.getReservationsByVehicle)
server.put('/reservations/:id', [checkAuth, hasAnyRole(UserRoles.ADMIN, UserRoles.USER)], reservationController.updateReservation)
server.delete('/reservations/:id', [checkAuth, hasAnyRole(UserRoles.ADMIN, UserRoles.USER)], reservationController.deleteReservation)
server.get('/admin-reservations', [checkAuth, hasAnyRole(UserRoles.ADMIN)], reservationController.getReservations)