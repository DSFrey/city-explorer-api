const axios = require('axios');
const express = require('express');
const app = express();

function getMovies(request, response) {
  let url = 'https://api.themoviedb.org/3/search/movie';
  let params = {
    api_key: process.env.MOVIE_API_KEY,
    query: request.query.searchQuery,
  };
  axios.get(url, { params })
    .then(reply => reply.data.results.map(movie => new Movie(movie)))
    .then(packagedData => response.status(200).send(packagedData))
    .catch(error => response.status(error.response.status).send(error));
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.vote_average = movie.vote_average;
    this.vote_count = movie.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    this.release_date = movie.release_date;
  }
}

app.use((error, request, response) => {
  response.status(error.response.status).send(error);
});

module.exports = getMovies;
