import io from 'socket.io-client';


const socket = io(process.env.NOTIFICATION_SERVICE_URL);

export const notificationService = {
    async notifyUser(userId, message) {
        const payload = {userId, message};
        console.log(`socket payload: ${JSON.stringify(payload)}`)
        socket.emit('notify', payload);
        socket.on('notification', (message) => {
            console.log('Received notification:', message);
        });
    }
}