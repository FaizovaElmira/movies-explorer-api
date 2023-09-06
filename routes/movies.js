const router = require('express').Router();
const { validateMovie, validateMovieID } = require('../middlewares/validate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovie, createMovie);
router.delete('/:movieId', validateMovieID, deleteMovie);

module.exports = router;
