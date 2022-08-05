'use strict';

console.log('You got served!!');

// Require
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getMovies = require('./modules/getMovies.js');
const getForecast = require('./modules/getForecast');

// Use
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// Routes
app.get('/movies', getMovies);
app.get('/forecast', getForecast);

// Class for constructing object

// Errors

// Listen for Port
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
