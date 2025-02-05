import { io } from 'socket.io-client';
import config from "@/config";
import {useToast} from "vue-toastification";

const socket = io(config.notificationsUrl);

export function useNotificationService(){
    const toast = useToast();
    async function registerSocket(){
        const user = JSON.parse(localStorage.getItem("user") ?? 'false');
        if (user && user.user_id) {
            const user_id = user.user_id
            socket.emit("register", user_id);
            console.log("Connected with socket ID:", socket.id);
            socket.off('notification');
            socket.on('notification', (data: any) => {
                console.log('Notification received:', data.message);
                toast.info(data.message);
            });
        }
    }

    async function disconnectSocket(){
        const user = JSON.parse(localStorage.getItem("user") ?? 'false');

        if (user && user.user_id) {
            const user_id = user.user_id
            console.log("Unregistering user from socket with ID:", socket.id);
            socket.emit("unregister", user_id);
        }
    }

    return {
        registerSocket,
        disconnectSocket
    };
}
