'use strict';

const express = require('express');
const router = express.Router();

const { nanoid } = require('nanoid');
const { retrieveDbFromRequest } = require('../db');
const { validateUser } = require('../validators');

/**
 * @typedef {Object} User
 * @property {string} id - User identifier
 * @property {string} username - Username
 */

/**
 * @typedef {Object} Rating
 * @property {string} id - The id of the rating
 * @property {string} userId - The id of the user who made the rating
 * @property {string} butterflyId - The id of the butterfly being rated
 * @property {number} rating - The rating value
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error message
 */

/**
 * @route GET /users/{id}
 * @param {string} id.path.required - The user id
 * @returns {User} 200 - The user details
 * @returns {Error} 404 - User not found
 */
router.get('/:id', async (req, res) => {
  const db = retrieveDbFromRequest(req);
  const user = await db.get('users')
    .find({ id: req.params.id })
    .value();

  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(user);
});

/**
 * @route GET /users/{id}/ratings
 * @param {string} id.path.required - The user ID
 * @returns {Rating[]} 200 - List of ratings by the user
 */
router.get('/:id/ratings', async (req, res) => {
  const db = retrieveDbFromRequest(req);

  const user = await db.get('users')
    .find({ id: req.params.id })
    .value();

  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }

  const ratings = await db.get('ratings')
    .filter({ userId: req.params.id })
    .orderBy(['rating'], ['desc'])
    .value();

  res.json(ratings);
});

/**
 * @typedef {Object} UserInput
 * @property {string} username - username
 */

/**
 * @route POST /users
 * @param {UserInput} request.body.required - User information
 * @param {string} request.body.username.required - username
 * @returns {User} 200 - The created user
 * @returns {Error} 400 - Invalid request body
 */
router.post('/', async (req, res) => {
  try {
    validateUser(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const newUser = {
    id: nanoid(),
    ...req.body
  };

  const db = retrieveDbFromRequest(req);
  await db.get('users')
    .push(newUser)
    .write();

  res.status(201).location(`/users/${newUser.id}`).json(newUser);
});

module.exports = router;
