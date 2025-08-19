const jwt = require("jsonwebtoken");
const { user } = require("../models/user");


const userAuth=async(req,res,next)=>{

    try{
    const cookie=req?.cookies;
    const {token}=cookie;
    if(!token){
        throw new Error("jwt token not found i guess")
    }

    const decodedObj=jwt.verify(token,"FlixGptSecret");
    const {_id}=decodedObj;

    const foundUser=await user.findOne({_id});

    if(!foundUser){
        throw new Error("No user found in db , try again")
    }

    

    req.foundUser=foundUser;
    next();
    }
    catch(err){
        res.status(400).send(err.message);
    }

    




}

module.exports={userAuth}