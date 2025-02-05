import {describe, expect, it} from "vitest";
import request from "../request";

describe('GET /vehicles', () => {
    it('returns 200 on /vehicles', async () => {
        const res = await request.get('/vehicles')
        console.log(res.body)
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    })
})