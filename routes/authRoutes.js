import express from 'express';
import authController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/add-user', authController.addUser);
authRouter.post('/verify-otp', authController.verifyOtp);
authRouter.post('/set-password', authController.setPassword);
authRouter.post('/login', authController.login);


export default authRouter;