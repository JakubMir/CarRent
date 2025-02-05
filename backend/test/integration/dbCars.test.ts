import {describe, expect, it} from "vitest";
import request, {authorizedRequest, login} from "../request";

describe('GET /db-cars', () => {
    it('returns 200 on /db-cars', async () => {
        const res = await request.get('/db-cars')
        console.log(res.body)
        expect(res.status).toBe(200);
    })
})

describe('GET /db-cars/:id', () => {
    it('returns 200 on /db-cars/:id', async () => {
        await login('admin@admin.cz','admin123')

        const carData = {
            make: "Test",
            model: "Test",
            year: 2022,
            fuelType: "Premium",
            drive: "RWD"
        };
        const car = await authorizedRequest.post('/db-cars', carData)

        const res = await request.get(`/db-cars/${car.body.id}`)
        console.log(res.body)
        expect(res.status).toBe(200);

        // delete car after test
        const carId = car.body.id;

        const deleteRes = await authorizedRequest.delete(`/db-cars/${carId}`);
        expect(deleteRes.status).toBe(204);
    })
})

describe('POST /db-cars', () => {
    it('returns 201 for admin on /db-cars', async () => {
        await login('admin@admin.cz','admin123')


        const carData = {
            make: "Test",
            model: "Test",
            year: 2022,
            fuelType: "Premium",
            drive: "RWD"
        };

        const res = await authorizedRequest.post('/db-cars', carData)

        console.log(res.body)
        expect(res.status).toBe(201);

        // delete car after test
        const carId = res.body.id;

        const deleteRes = await authorizedRequest.delete(`/db-cars/${carId}`);
        expect(deleteRes.status).toBe(204);
    })
})

describe('POST /db-cars', () => {
    it('returns 403 for user on /db-cars', async () => {
        await login('test@test.cz','test123')


        const carData = {
            id: "testCar1",
            make: "Test",
            model: "Test",
            year: 2022,
            fuelType: "Premium",
            drive: "RWD"
        };

        const res = await authorizedRequest.post('/db-cars', carData)

        console.log(res.body)
        expect(res.status).toBe(403);
    })
})