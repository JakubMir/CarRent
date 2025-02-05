import express = require('express');
import {Config} from "../config";
import {createServer} from "http";
import {socketServer} from "./socket/socket.server";
import cors = require('cors');


async function init() {
    const app = express();
    const server = createServer(app);

    socketServer.init(server);

    server.listen(Config.port, () => {
        console.log(`Server is running on port ${Config.port}`);
    });

}

init()