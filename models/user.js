const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema({
    
email:{type:String,required:true,unique:true,lowercase:true,trim:true},

password:{type:String,required:true,},

name:{type:String,required:true,trim:true},



},{timestamps:true})

userSchema.methods.getJWT=async function(){

    const u=this;
    const token=jwt.sign({_id:u._id},"FlixGptSecret");
    return token;
}

const user=mongoose.model("user",userSchema);

module.exports={user};