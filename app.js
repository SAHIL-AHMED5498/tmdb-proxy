require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
//const fetch=require("node-fetch") //node-fetch v2
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));  //node-fetch v3


const app = express();
const PORT = process.env.PORT || 8000;
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const GROQ_API_KEY=process.env.GROQ_AI_API_KEY;

const internal_key=process.env.INTERNAL_KEY;


//SIMPLE AUTH CHECK TO CREATE PROTECTED ROUTES
const auth=(req,res,next)=>{
  const client_key=req.headers["internal-key"];
  try{
      if(client_key!=internal_key){
    throw new Error("Accessed Denied");
    
  }
  else{
    next();
  }


}catch(err){
  console.log(err);
  res.status(400).send("Failed to access"+err.message);

}

  }

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));


//CORS RESTRICTION 
// app.use(cors({
//   origin: 'https://flix-gpt-f48c8.web.app/', 
// }));


//TO PREVENT SERVER FROM GETTING COLD
app.get("/ping",(res)=>{
  res.send("OK")

});

//TO SEND REQUEST TO Groq AI API
app.post("/api/ai", auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      throw new Error("message is required");
    }

    const query = `Act as a movie manager , send response just a javascript array of 5 movies and nothing else for example [m1,m2,m3,m4,m5] also make sure for any other query which is not related to asking for movie names just send a empty array . HERE IS THE QUERY : ${message}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: query }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(400).json({ error: data });
    }

    res.json({ reply: JSON.parse(data.choices[0].message.content) });

  } catch (err) {
    console.error(err);
    res.status(400).send("Failed to access: " + err.message);
  }
});




//TO SEND PROXY REQUEST TO TMDB SERVER
app.use('/', createProxyMiddleware({
  target: 'https://api.themoviedb.org',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Add headers for Bearer token (v4)
    if (TMDB_BEARER_TOKEN) {
      proxyReq.setHeader('Authorization', `Bearer ${TMDB_BEARER_TOKEN}`);
      proxyReq.setHeader('accept', 'application/json');
    }

    // Inject api_key (v3) if needed and not already present
    if (TMDB_KEY && !req.url.includes('api_key=') && !TMDB_BEARER_TOKEN) {
      proxyReq.path += (proxyReq.path.includes('?') ? '&' : '?') + `api_key=${TMDB_KEY}`;
    }
  }
}));

app.listen(PORT, () => {
  console.log(`TMDB proxy running on port ${PORT}`);
});
