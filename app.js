require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

//const fetch=require("node-fetch") //node-fetch v2


const {aiSearchRouter}=require("./routes/ai")
const {tmdbProxyRouter}=require("./routes/tmdbProxy")


const app = express();
const PORT = process.env.PORT || 8000;








app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: `https://flix-gpt-f48c8.web.app`, // allow your React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));





//TO PREVENT SERVER FROM GETTING COLD
app.get("/ping",(req,res)=>{
  res.send("OK")

});

app.use("/",aiSearchRouter);

app.use("/",tmdbProxyRouter);







app.listen(PORT, () => {
  console.log(`TMDB proxy running on port ${PORT}`);
});
