import * as grpc from '@grpc/grpc-js';
import {loadProto} from "../proto/proto-loader";
import {auth, firestore} from "../config/firebase";
import {UserRoles} from "../types/UserRoles";
import {AuthDto} from "../api/controllers/auth/auth.dto";

const authProto = loadProto('auth');

const authClient = new authProto.AuthService(
    process.env.AUTH_SERVICE_URL || 'localhost:50052',
    grpc.credentials.createInsecure()
);

export const authService = {
    async registerUser(data: AuthDto): Promise<string> {
        return new Promise((resolve, reject) => {
            authClient.signUp(data, async (error: any, response: any) => {
                if (error) {
                    console.error('gRPC Error:', error.message);
                    reject(new Error('Failed to register user: ' + error.message));
                } else {
                    console.log('gRPC Response:', response);
                    const userId = response.userId;

                    try {
                        await this.saveUserToDb(userId, data);
                        resolve(userId);
                    } catch (dbError) {
                        console.error("Error saving user to Firestore:", dbError);
                        reject(new Error('Failed to save user to Firestore: ' + dbError.message));
                    }
                }
            });
        });
    },

    async loginUser(data: AuthDto): Promise<string> {
        return new Promise((resolve, reject) => {
            authClient.login(data, async (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    console.log("Login successful: ", response);
                    resolve(response.token);
                }
            });
        });
    },

    async saveUserToDb(userId: string, data: AuthDto): Promise<void> {
        try {
            console.log("Saving user to Firestore:", userId);
            const userRef = firestore.collection("users").doc(userId);

            await userRef.set({
                userId,
                email: data.email,
                password: data.email,
                role: UserRoles.USER
            });

            console.log("User saved to Firestore:", userId);
        } catch (error) {
            console.error("Error saving user to Firestore:", error);
            throw new Error("Failed to save user to database");
        }
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
    },

    async getUserRole(userId: string): Promise<string> {
        try {
            const userRef = firestore.collection("users").doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                throw new Error('User not found');
            }

            return userDoc.data().role || UserRoles.USER;
        } catch (error) {
            console.error('Error fetching user role:', error);
            throw new Error('Error retrieving user role');
        }
    }
}
