'use strict';

const v = require('@mapbox/fusspot');

const validateButterfly = v.assert(
  v.strictShape({
    commonName: v.required(v.string),
    species: v.required(v.string),
    article: v.required(v.string)
  })
);

const validateUser = v.assert(
  v.strictShape({
    username: v.required(v.string)
  })
);

const isValidRating = (value) => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 5) {
    throw new Error('Rating must be an integer between 0 and 5');
  }
};

const validateRating = v.assert(
  v.strictShape({
    butterflyId: v.required(v.string),
    rating: v.required(isValidRating),
    userId: v.required(v.string)
  })
);

module.exports = {
  validateButterfly,
  validateRating,
  validateUser
};
