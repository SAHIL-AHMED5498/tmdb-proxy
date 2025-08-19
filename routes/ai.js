require('dotenv').config();
const express=require("express");
const {auth}=require("../middlewares/auth");
const { userAuth } = require('../middlewares/userAuth');
const aiSearchRouter=express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));  //node-fetch v3


const GROQ_API_KEY=process.env.GROQ_AI_API_KEY;





//TO SEND REQUEST TO Groq AI API
aiSearchRouter.post("/api/ai",auth,async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      throw new Error("message is required");
    }


    const query = `
You are an intelligent movie and TV recommendation engine.
Your job is to handle even vague or unusual queries by interpreting the user's intent and returning matching titles.
If the request is for something like "romantic movies with time travel," you must use fuzzy search logic to still produce a relevant list.

Rules:
1. Return ONLY a valid JavaScript array of exactly 10 distinct movie or TV show titles.
2. No explanations, no numbering, no extra words — just the array.
3. Titles must be plain strings without years unless the year is part of the official title.
4. Always provide results even if the query is vague or oddly specific — use related matches if needed.
5. If the query is unrelated to movies/TV, return [].

User query: ${message}
`;
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

  } 
  
  
  
  
  
  catch (err) {
    console.error(err);
    res.status(400).send(`Failed to access:${err?.message||"unknown error"}`);
  }
});

module.exports={aiSearchRouter}