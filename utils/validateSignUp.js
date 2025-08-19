const { user } = require("../models/user")
const validator=require("validator")

const ValidateSignUpData=async (req)=>{
    const {email,pass,name}=req.body;
    
        const isEmailExist=await user.findOne({email})
      

        if(!validator.isEmail(email)){
            throw new Error("Invalid Email")
        }
        else if(!validator.isStrongPassword(pass)){
            throw new Error("Not strong password")
        }
        else if(name.length<4){
            throw new Error("Name too short")
        }

        else if(isEmailExist){
            throw new Error("Email already Exist")
        }
        else{
            return true
        }





    
  
    



}

module.exports={ValidateSignUpData}