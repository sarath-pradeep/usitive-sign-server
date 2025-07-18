import express from 'express';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/dbConfig.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

await dbConnect();

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});