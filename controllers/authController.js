import  asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { prisma } from '../app.js';
import bcrypt from 'bcrypt'

async function hashPassword (password) {

    const saltRounds = 10;
  
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
  
    return hashedPassword
  }

export const signup = asyncHandler(async(req, res)=>{
    const {username, email, password, password_repeat} = req.body;
    if(password != password_repeat) {
        return res.status(400).json("Sorry ! But the 2 passwords don't match");
    }

    const hash = await hashPassword(password);
    const user = await prisma.user.create({
        data:{
            username, email, password: hash
        }
    })
    delete user.password
  
    const token = jwt.sign({id: user.id}, "ANNESHA_GUHA");
 
    res.json({
        data: {
            token, user
        }
    })

});



export const signin = asyncHandler(async(req,res, next)=>{
   const {email , password} = req.body;
   const user = await prisma.user.findUnique({
    where:{email: email}
   });
   if(!user) return res.status(400).json("Your email is not registered yet! Please create an account first")
   const compare = await bcrypt.compare(password, user.password);
   console.log(compare)
   if(!compare){
        return res.status(400).json("Incorrect Email and Password Combination")
   }
   const token = jwt.sign({id: user.id}, "ANNESHA_GUHA");
   delete user.password
   res.json({
       data:{
           token, user
       }
   })
});




export  const protect = asyncHandler(async(req, res, next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1]
        const decoded =   await promisify(jwt.verify)(token, "ANNESHA_GUHA")
        const user  = await prisma.user.findUnique({where:{id: decoded.id}})
        if(!user){
            return res.status(401).send("User no longer exists in the database");
        }
        req.body.user = user;
        next()
    }else{
        res.status(401).send("Your are not authorized for this request");
    }
})