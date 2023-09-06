const mongoose = require('mongoose');
const validator = require('validator');

const { Schema, ObjectId } = mongoose;
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { movieNotFound, unauthorizedToDeleteMovie, invalidUrl } = require('../utils/constants');

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: invalidUrl,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: invalidUrl,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: invalidUrl,
    },
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
});

movieSchema.statics.delJustOwnMovie = async function deleteMovie(movieId, userId) {
  const movie = await this.findById(movieId);
  if (!movie) {
    throw new NotFoundError(movieNotFound);
  }
  if (movie.owner.toString() !== userId) {
    throw new ForbiddenError(unauthorizedToDeleteMovie);
  }
  await movie.deleteOne();
};

module.exports = mongoose.model('movie', movieSchema);
