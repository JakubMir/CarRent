import {server} from "../src/api/server";

const supertest = require('supertest')

const request = supertest(server)

export default request

let token: string = ''

export async function login(email: string, password: string) {
    const url = `http://localhost:3000/login`

    const body = JSON.stringify({
        email: email,
        password: password,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })

    if (!response.ok) {
        console.error('Login failed', await response.json())
        throw new Error('Login as ' + email + ' failed')
    }

    const data = await response.json()
    token = data.token

    console.log('Logged in as ', email, ' with token ', token)
    return token
}

function createAuthorizedRequest(requestCall: any, data: any) {
    if (!token) {
        throw new Error('Cannot send authorized request without token, call login() first')
    }

    return requestCall.set('Authorization', `Bearer ${token}`).send(data);
}

export const authorizedRequest = {
    get: (url: string) => createAuthorizedRequest(request.get(url), {}),
    post: (url: string, data: any) => createAuthorizedRequest(request.post(url), data),
    put: (url: string, data: any) => createAuthorizedRequest(request.put(url), data),
    delete: (url: string) => createAuthorizedRequest(request.delete(url), {}),
}
