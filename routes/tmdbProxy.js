require('dotenv').config();
const express=require("express");
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const { createProxyMiddleware } = require('http-proxy-middleware');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));  //node-fetch v3


const tmdbProxyRouter=express.Router();


//TO SEND PROXY REQUEST TO TMDB SERVER
tmdbProxyRouter.use('/', createProxyMiddleware({
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

module.exports={tmdbProxyRouter}