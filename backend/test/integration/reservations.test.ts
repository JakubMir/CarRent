import {describe, expect, it} from "vitest";
import request, {authorizedRequest, login} from "../request";
import {decodeJwt} from "firebase-admin/lib/utils/jwt";
import {authService} from "../../src/business/auth.service";
import {StatusTypes} from "../../src/types/StatusTypes";

describe('GET /admin-reservations', () => {
    it('returns 200 on /admin-reservations', async () => {
        await login('admin@admin.cz','admin123')

        const res = await authorizedRequest.get('/admin-reservations')
        console.log(res.body)
        expect(res.status).toBe(200);
    })
})

describe('GET /reservations/:userId', () => {
    it('returns 200 on /reservations/:userId', async () => {
        const token = await login('admin@admin.cz','admin123')
        const decodedToken = await authService.verifyToken(token)

        const res = await authorizedRequest.get(`/reservations/${decodedToken.userId}`)
        expect(res.status).toBe(200)
    })
})

describe('GET /reservations/vehicle/:id', () => {
    it('returns 200 on /reservations/vehicle/:id', async () => {
        await login('admin@admin.cz','admin123')

        const carData = {
            make: "Test",
            model: "Test",
            year: 2022,
            fuelType: "Premium",
            drive: "RWD"
        };

        const insertedCarRes = await authorizedRequest.post('/db-cars', carData)

        const carId = insertedCarRes.body.id;

        const res = await authorizedRequest.get(`/reservations/vehicle/${carId}`)
        expect(res.status).toBe(200)

        const deleteRes = await authorizedRequest.delete(`/db-cars/${carId}`);
        expect(deleteRes.status).toBe(204);
    })
})

describe('PUT /reservations/:id', () => {
    it('returns 200 on /reservations/:id', async () => {
        await login('admin@admin.cz','admin123')

        const carData = {
            make: "Test",
            model: "Test",
            year: 2022,
            fuelType: "Premium",
            drive: "RWD"
        };

        const insertedCarRes = await authorizedRequest.post('/db-cars', carData)

        const carId = insertedCarRes.body.id;

        let reservationData = {
            vehicleId: carId,
            startDate: "01/09/2030",
            endDate: "02/09/2030",
            status: StatusTypes.PENDING
        }

        const insertedReservationRes = await authorizedRequest.post('/reservations', reservationData)

        const reservationId = insertedReservationRes.body.id;

        reservationData = insertedReservationRes.body

        reservationData.endDate = "03/09/2030"

        const res = await authorizedRequest.put(`/reservations/${reservationId}`, reservationData)
        expect(res.status).toBe(200)

        const deleteRes = await authorizedRequest.delete(`/reservations/${reservationId}`);
        expect(deleteRes.status).toBe(204);

        const deleteCar = await authorizedRequest.delete(`/db-cars/${carId}`);
        expect(deleteCar.status).toBe(204);
    })
})