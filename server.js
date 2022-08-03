'use strict';

console.log('You got served!!');

// Require
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');
const {response} = require('express');

// Use
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// Routes
app.get('/forecast', (request, response) => {
  try{
    let search = request.query.search;
    // let lat = request.query.lat;
    // let lon = request.query.lon;
    let locationData = data.find(location => location.city_name === search);
    //|| data.find(location => parseInt(location.lat).round() === parseInt(lat).round() && parseInt(location.lon).round() === parseInt(lon).round());
    let returnForecast = locationData.data.map((dailyData) => new Forecast(dailyData));
    // console.log(returnForecast);
    response.send(returnForecast);
  } catch(error){
    console.log('HALP!!',error);
    response.status(500).send('Forecast not found for this location');
  }
});
// Class for constructing our object

class Forecast {
  constructor(dailyData) {
    this.description = `Low of ${dailyData.low_temp}, high of ${dailyData.high_temp} with ${dailyData.weather.description}.`;
    this.date = dailyData.datetime;
  }
}
// Errors

// Listen for Port
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
