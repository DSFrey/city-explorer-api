const axios = require('axios');
const express = require('express');
const app = express();
let cache = require('./cache');

function getForecast(request, response) {
  const { lat, lon } = request.query;
  const key = `weather_${lat}_${lon}`;
  let url = 'https://api.weatherbit.io/v2.0/forecast/daily';
  let params = {
    key: process.env.WEATHER_API_KEY,
    lat: lat,
    lon: lon,
    units: 'I',
    days: 8,
  };
  if (cache[key] && (Date.now() - cache[key].timestamp < 600000)) {
    console.log('Cache hit');
    response.status(200).send(cache[key].data);
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    axios.get(url, { params })
      .then(reply => reply.data.data.map((dailyData) => new Forecast(dailyData)))
      .then(packagedData => {
        cache[key].data = packagedData;
        response.status(200).send(packagedData);
      })
      .catch(error => response.status(error.response.status).send(error));
  }
}

class Forecast {
  constructor(dailyData) {
    this.icon = `https://www.weatherbit.io/static/img/icons/${dailyData.weather.icon}.png`;
    this.description = dailyData.weather.description;
    this.rain = dailyData.pop;
    this.high = dailyData.max_temp;
    this.low = dailyData.min_temp;
    this.date = dailyData.datetime;
  }
}

app.use((error, request, response) => {
  response.status(error.response.status).send(error);
});

module.exports = getForecast;
