import {Server} from "socket.io";
import * as http from "node:http";


let io = null
const userSockets = new Map();

export const socketServer = {

    init(httpServer: http.Server) {
        io = new Server(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN
            }
        });

        console.log('Allowed CORS for', process.env.CORS_ORIGIN)

        io.on("connection", socket => {
            console.log('A user connected:', socket.id);

            socket.on('register', (uid: string) => {
                console.log(`User ${uid} registered with socket ${socket.id}`);
                userSockets.set(uid, socket.id);
            });

            socket.on("unregister", (userId: string) => {
                console.log(`User ${userId} unregistered.`);
                userSockets.delete(userId);
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected:', socket.id);
                // @ts-ignore
                for (const [uid, id] of userSockets.entries()) {
                    if (id === socket.id) {
                        userSockets.delete(uid);
                        break;
                    }
                }
            });

            socket.on('notification', (data) => {
                console.log('Notification received:', data);
            });

            socket.on('notify', (data) => {
                console.log(`notify: ${JSON.stringify(data)}`)
                const { userId, message } = data
                const socketId = userSockets.get(userId);
                if (socketId) {
                    io.to(socketId).emit('notification', { message });
                    console.log('Notification sent:', message);
                }
            });
        });

        console.log('Socket.io: Initialized')
    },
}