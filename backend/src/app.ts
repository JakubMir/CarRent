import 'reflect-metadata';
import {Config} from "../config";
import { createServer } from "http";
import { server as apiServer } from "./api/server";

async function init() {

    const httpServer = createServer(apiServer);

    httpServer.listen(Config.port, () => {
        console.log(`Listening on http://localhost:${Config.port}`)
    })
}

init()
