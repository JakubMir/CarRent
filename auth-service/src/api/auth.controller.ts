import { authService } from "../business/auth.service";
import {loadProto} from "../proto/proto-loader";

export const authProto = loadProto('auth');
export const authController = {
    async signUp(call: any, callback: any) {
        try {
            const { email, password } = call.request;
            const result = await authService.signUp(email, password);
            callback(null, result);
        } catch (error) {
            console.log(`SignUp error code: ${error.code}`)
            if (error.code === 'auth/email-already-exists') {
                callback({ code: 409, message: 'Email is already in use' });
            } else {
                callback({ code: 500, message: error.message });
            }
        }
    },

    async login(call: any, callback: any) {
        try {
            const { email, password } = call.request;
            const result = await authService.login(email, password);
            callback(null, result);
        } catch (error) {
            callback({ code: 401, message: error.message });
        }
    },

    async verifyToken(call: any, callback: any) {
        try {
            const { token } = call.request;
            const result = await authService.verifyToken(token);
            callback(null, result);
        } catch (error) {
            callback({ code: 401, message: error.message });
        }
    },
};
