require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8000;
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

app.use(helmet());
app.use(morgan('dev'));

app.get("/ping",(req,res)=>{
  res.send("OK")

});

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
