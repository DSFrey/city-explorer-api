'use strict';

console.log('You got served!!');

// Require
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');
const {response} = require('express');
const axios = require('axios');
const getMovies = require('./modules/getMovies.js')

// Use
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// Routes
app.get('/forecast', async (request, response) => {
  try{
    let forecastData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${parseInt(request.query.lat)}&lon=${parseInt(request.query.lon)}&units=I&days=8&key=${process.env.WEATHER_API_KEY}`);
    console.log(forecastData);
    let returnForecast = forecastData.data.data.map((dailyData) => new Forecast(dailyData));
    response.send(returnForecast);
  } catch(error){
    response.status(error.response.status).send('Forecast not found for this location');
  }
});

app.get('/movies', getMovies);

// Class for constructing object

class Forecast {
  constructor(dailyData) {
    this.icon = `https://www.weatherbit.io/static/img/icons/${dailyData.weather.icon}.png`
    this.description = dailyData.weather.description;
    this.rain = dailyData.pop;
    this.high = dailyData.max_temp;
    this.low = dailyData.min_temp;
    this.date = dailyData.datetime;
  }
}
// Errors

// Listen for Port
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
