import express from "express";
import {authService} from "../../../business/auth.service";
import {validateBody} from "../../../middleware/validation.middleware";
import {AuthDto} from "./auth.dto";

export const authController = {
    async registerUser(req: express.Request, res: express.Response) {
        const dto = await validateBody(req, AuthDto);
        const { email, password } = dto

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required." }).send();
        }

        try {
            const userId = await authService.registerUser(dto);
            console.log("User registered:", userId);
            res.status(201).send(userId);

        } catch (error) {
            console.error('Error registering user:', error.message);
            if (error.message.includes("409")) {
                res.status(409).json({ message: 'Email is already in use.' }).send();
            } else {
                res.status(500).json({ message: 'Failed to register user.' }).send();
            }
        }
    },

    async loginUser(req: express.Request, res: express.Response) {
        const dto = await validateBody(req, AuthDto);
        const { email, password } = dto;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required." }).send();
        }

        try {
            const token = await authService.loginUser(dto);
            const decodedToken = await authService.verifyToken(token)

            const userRole = await authService.getUserRole(decodedToken.userId)

            console.log("User logged in, token:", token);
            console.log("Logged user role:",userRole)
            res.status(200).send({token, userRole});

        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ message: 'Failed to log in user.' }).send();
        }
    }
};
