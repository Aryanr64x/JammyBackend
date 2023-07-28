import express, { application } from 'express'

const app = express();

import http from 'http'

const server = http.createServer(app);

import {Server} from 'socket.io';

const io = new Server(server, {
    cors:{
        origin: "https://jammy-backend.onrender.com"
    }
});

import cors from 'cors'
import authRouter from './routes/authRouter.js'
import { PrismaClient } from '@prisma/client';
import jamRouter from './routes/jamRouter.js';
export const prisma = new PrismaClient()





app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/jam', jamRouter)

app.get('/', async(req, res)=>{
  try{
    const users = await prisma.user.findMany({})
    console.log(users)
  }catch(e){
    console.log(e)
  }
  res.json("WELCOME TO THE JAMMY API")
})


io.on('connection', (socket) => {
  socket.on("join-room", (id)=>{
    socket.join(id);
    console.log("Successfully Joined "+id)
  })


  socket.on("new-change", (data)=>{
    console.log(data.body);
    socket.to(data.room).emit("tell-client", data.body);
  })

});



server.listen(8000, () => {
  console.log('listening on *:8000');
});