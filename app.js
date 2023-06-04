import express from 'express';
import  cors from 'cors'
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/authRouter.js';
export const prisma = new PrismaClient();
const app = express();
app.use(cors())
app.use(express.json());


app.use('/api/auth', authRouter)


app.listen(8000, ()=>{
    console.log("The server has started")
});
