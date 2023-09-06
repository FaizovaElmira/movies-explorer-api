const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  invalidMovieData,
  movieNotFound,
  unauthorizedToDeleteMovie,
  invalidMovieIdData,
  movieDeleted,
} = require('../utils/constants');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.status(200).send(movies);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const movie = await Movie.create({ ...req.body, owner });
    res.status(201).send(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(invalidMovieData));
    } else {
      next(error);
    }
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError(movieNotFound);
    }

    if (movie.owner.toString() !== userId) {
      throw new ForbiddenError(unauthorizedToDeleteMovie);
    }

    await movie.deleteOne();
    res.status(200).send({ message: movieDeleted });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(invalidMovieIdData));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
