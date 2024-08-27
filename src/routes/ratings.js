'use strict';

const express = require('express');
const router = express.Router();

const { nanoid } = require('nanoid');
const { retrieveDbFromRequest } = require('../db');
const { validateRating } = require('../validators');

/**
 * @typedef {Object} Rating
 * @property {string} id - The unique identifier for the rating
 * @property {string} userId - Id of the user who submitted the rating
 * @property {string} butterflyId - Butterfly Id
 * @property {number} rating - 0-5 rating
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error message
 */

/**
 * @route PUT /ratings/{id}
 * @description Update a rating
 * @param {string} id.path.required - The unique identifier of the rating
 * @param {Object} request.body.required - Updated rating information
 * @param {number} request.body.rating.required - Updated rating value (0-5)
 * @returns {Rating} 200 - Successful response with updated rating
 * @returns {ErrorResponse} 404 - Rating not found
 * @returns {ErrorResponse} 400 - Invalid request body
 * @throws {Error} - Unexpected error
 */
router.put('/:id', async (req, res) => {
  const db = retrieveDbFromRequest(req);
  const { rating: newRatingValue } = req.body;

  if (typeof newRatingValue !== 'number' || newRatingValue < 0 || newRatingValue > 5) {
    return res.status(400).json({ error: 'Invalid rating. Must be a number between 0 and 5.' });
  }

  const rating = await db.get('ratings')
    .find({ id: req.params.id })
    .value();

  if (!rating) {
    return res.status(404).json({ error: 'Rating not found' });
  }

  const updatedRating = await db.get('ratings')
    .find({ id: req.params.id })
    .assign({ rating: newRatingValue })
    .write();

  res.json(updatedRating);
});

/**
 * @route GET /ratings/{id}
 * @description Get a rating by ID
 * @param {string} id.path.required - The unique identifier of the rating
 * @returns {Rating} 200 - Successful response with rating details
 * @returns {ErrorResponse} 404 - Rating not found
 * @throws {Error} - Unexpected error
 */
router.get('/:id', async (req, res) => {
  const db = retrieveDbFromRequest(req);
  const rating = await db.get('ratings')
    .find({ id: req.params.id })
    .value();

  if (!rating) {
    return res.status(404).json({ error: 'Rating not found' });
  }

  res.json(rating);
});

/**
 * @route POST /ratings
 * @description Create a new rating
 * @param {Object} request.body.required - Rating information
 * @param {string} request.body.userId.required - ID of the user submitting the rating
 * @param {string} request.body.butterflyId.required - ID of the butterfly being rated
 * @param {number} request.body.rating.required - Rating value (0-5)
 * @returns {Rating} 201 - Successful response with created rating
 * @returns {ErrorResponse} 400 - Invalid request body
 * @throws {Error} - Unexpected error
 */
router.post('/', async (req, res) => {
  try {
    validateRating(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { userId, butterflyId, rating } = req.body;

  const db = retrieveDbFromRequest(req);
  const user = await db.get('users')
    .find({ id: userId })
    .value();

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const butterfly = await db.get('butterflies')
    .find({ id: butterflyId })
    .value();

  if (!butterfly) {
    return res.status(400).json({ error: 'Butterfly not found' });
  }

  const newRating = {
    id: nanoid(),
    userId,
    butterflyId,
    rating
  };

  await db.get('ratings')
    .push(newRating)
    .write();

  res.status(201).location(`/ratings/${newRating.id}`).json(newRating);
});

/**
 * @route DELETE /ratings/{id}
 * @description Delete a rating
 * @param {string} id.path.required - The unique identifier of the rating
 * @returns {} 204 - Successful response (no content)
 * @returns {ErrorResponse} 404 - Rating not found
 * @throws {Error} - Unexpected error
 */
router.delete('/:id', async (req, res) => {
  const db = retrieveDbFromRequest(req);
  const removed = await db.get('ratings')
    .remove({ id: req.params.id })
    .write();

  if (removed.length === 0) {
    return res.status(404).json({ error: 'Rating not found' });
  }

  res.status(204).send();
});

module.exports = router;
