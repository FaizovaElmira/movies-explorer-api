const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

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
      next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
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
      throw new NotFoundError('Фильм с указанным _id не найден');
    }

    if (movie.owner.toString() !== userId) {
      throw new ForbiddenError('Нет прав для удаления фильма');
    }

    await movie.deleteOne();
    res.status(200).send({ message: 'Фильм удален' });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при удалении фильма'));
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
