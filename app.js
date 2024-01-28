import asyncHandler from 'express-async-handler'

import express, { application } from 'express'


const app = express();

import http from 'http'

const server = http.createServer(app);

import { Server } from 'socket.io';


const io = new Server(server, {
  cors: {
    origin: "*"
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

app.delete('/delete', async(req, res)=>{

    const jams = await prisma.jam.findMany({})
    console.log(jams)
    await prisma.jam.delete({where:{id:8}})
    res.json("done")

})

app.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({})
    console.log(users)
  } catch (e) {
    console.log(e)
  }
  res.json("WELCOME TO THE JAMMY API")
})



app.use('*', ()=>{
  let error = new Error("404 route not found")
  error.code = 404
  throw error;
})

app.use((err, req, res, next)=>{
    err.code = err.code || 500;
    err.message = err.message || "Oops ! Something just went wrong"
    res.status(err.code).json(err.message)
})


io.on('connection', (socket) => {


  socket.on("join-room", async (data) => {
  
    try {

      if (data.userExists == 0 && data.isCreator == 0) {
        // creating new contrubyter here saves me an API CALL
        console.log("New contributer is being created")
        await prisma.user.update({ where: { id: data.userId }, data: { contributedJams: { connect: { id: data.jamId } } } });
        const user = await prisma.user.findUnique({ where: { id: data.userId } });
        console.log(user.username+" event send")
        socket.to(data.jamId).emit("new-contributer", user);    
      }else{
        console.log("new user has not been created")
      } 

      socket.join(data.jamId);
      console.log("Successfully Joined")


    } catch (e) {
      console.log(e.message)
    }

  })


  socket.on("new-change", (data) => {
    console.log(data.body);
    socket.to(data.room).emit("tell-client", data.body);
  })

});




server.listen(8000, () => {
  console.log('listening on *:8000');
});