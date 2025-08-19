require('dotenv').config();
const express=require("express");
const {user}=require("../models/user");
const { ValidateSignUpData } = require("../utils/validateSignUp");
const bcrypt=require("bcrypt");

const authRouter=express.Router();

authRouter.post("/auth/signUp",async(req,res)=>{





    try{
    //VALIDATE SENT DATA AT SERVER LEVEL
       await ValidateSignUpData(req);

    //HASH THE PASSWORD 

       const hashPass=await bcrypt.hash(req.body.pass,10)

    //CREATE THE INSTANCE

        const User=new user({
            email:req.body.email,
            password:hashPass,
            name:req.body.name
        })

    //SAVE IT IN DB


       
        await User.save();

    //MAKE THE TOKEN FOR THAT USER

        const token=await User.getJWT();

    //SAVE IT IN COOKIE
        res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });


        res.status(200).send(User)
    
    }

    catch(err){

        res.status(400).send(`sign up route Error ${err.message}`)

    }

})

authRouter.post("/auth/signIn",async(req,res)=>{
    const {email,pass}=req.body;

    try{

         const User=await user.findOne({email})

         //CHECK IF USER EXIST
         
         if(!User){throw new Error("User doesnt exist")}

         const isValidPass=bcrypt.compare(pass,User.password);

         //VALIDATE PASSWORD

         if(!isValidPass){
            throw new Error("Auth Failed Incorrect Password")
         }
         //MAKE THE TOKEN

        const token= await User.getJWT()

        //SAVE TO COOKIE
          res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

         res.status(200).send(User);
    }
    catch(err){
        res.status(400).send(err.message)
    }

   

})

authRouter.post("/auth/logout",(req,res)=>{

    try{
    res.cookie("token","");
    res.status(200).send("loggout out successfully")
    }
    catch(err){

        res.send(err.message)
    }


})

module.exports={authRouter}