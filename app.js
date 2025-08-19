require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser=require("cookie-parser")

//const fetch=require("node-fetch") //node-fetch v2


const {aiSearchRouter}=require("./routes/ai")
const {tmdbProxyRouter}=require("./routes/tmdbProxy");
const { auth } = require('./middlewares/auth');
const { db } = require('./config/database');
const { authRouter } = require('./routes/auth');
const { userAuth } = require('./middlewares/userAuth');


const app = express();
const PORT = process.env.PORT || 8000;






//`https://flix-gpt-f48c8.web.app`

app.use(express.json());
app.use(cookieParser());

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: "http://localhost:3000", // allow your React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



app.get("/view/profile",userAuth,(req,res)=>{

 const loggedInUser=req.foundUser;
  res.json(loggedInUser);

});

//TO PREVENT SERVER FROM GETTING COLD
app.get("/ping",(req,res)=>{
  res.send("OK")

});
app.use("/",authRouter);

app.use("/",aiSearchRouter);

app.use("/",tmdbProxyRouter);







db()
.then(()=>{
  console.log("connected to db");
  app.listen(PORT, () => {
  console.log(`TMDB proxy running on port ${PORT}`);
});
})
.catch((err)=>console.log(err.message));

