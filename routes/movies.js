const moviesRoutes = require('express').Router();
const { validateMovie, validateMovieID } = require('../middlewares/validate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRoutes.get('/', getMovies);
moviesRoutes.post('/', validateMovie, createMovie);
moviesRoutes.delete('/:movieId', validateMovieID, deleteMovie);

module.exports = moviesRoutes;
