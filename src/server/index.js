require('dotenv').config({ path: '.env.local' });
const express = require('express');


const app = express();
const cors = require('cors');
const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors());