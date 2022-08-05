const axios = require('axios');
const express = require('express');
const app = express();

function getForecast(request, response) {
  let url = 'https://api.weatherbit.io/v2.0/forecast/daily';
  let params = {
    key: process.env.WEATHER_API_KEY,
    lat: request.query.lat,
    lon: request.query.lon,
    units: 'I',
    days: 8,
  };
  axios.get(url, { params })
    .then(reply => reply.data.data.map((dailyData) => new Forecast(dailyData)))
    .then(packagedData => response.status(200).send(packagedData))
    .catch(error => response.status(error.response.status).send(error));
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
