import firebase, { auth } from "../config/firebase";
import {Config} from "../../config";

export const authService = {
    async signUp(email: string, password: string): Promise<{ userId: string }> {
        console.log("creating user")
        const userRecord = await auth.createUser({ email, password });
        console.log(`auth-service signUp record ${userRecord.uid}`)
        return { userId: userRecord.uid };
    },

    async login(email: string, password: string): Promise<{ token: string }> {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${Config.firebase.api_key}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        });

        if (!response.ok) {
            const error = await response.json();
            if (error.code === 'auth/email-already-exists') {
                throw new Error('EmailAlreadyExists');
            }
            throw new Error(error.error.message);
        }

        const data = await response.json();
        return { token: data.idToken }; // ID token
    },

    async verifyToken(token: string): Promise<{ userId: string; email: string }> {
        try {
            const decodedToken = await auth.verifyIdToken(token);

            return {
                userId: decodedToken.uid,
                email: decodedToken.email || "",
            };
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Token is invalid or expired');
        }
    }
}
