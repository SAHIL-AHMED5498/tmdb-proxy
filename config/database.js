require('dotenv').config();

const mongoose=require("mongoose");

const p=process.env.DB_PASSWORD;


const db=async ()=>{await mongoose.connect(`mongodb+srv://ahmedsahil5498:${p}@cluster0.z9lqp.mongodb.net/Flix-Gpt`) }

module.exports={db}