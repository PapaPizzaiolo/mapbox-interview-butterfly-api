'use strict';

const { nanoid } = require('nanoid');
const { validateButterfly } = require('../validators');
const { retrieveDbFromRequest } = require('../db');

const router = require('express').Router();

/**
 * @typedef {Object} Butterfly
 * @property {string} id - The unique identifier for the butterfly
 * @property {string} commonName: Common name for the butterfly, ex. "Zebra Swallowtail"
 * @property {string} species: Scientific species name of the butterfly, ex. "Protographium marcellus"
 * @property {string} article: Url to article for more information on the butterfly, ex. "https://en.wikipedia.org/wiki/Protographium_marcellus"
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error message
 */

/**
 * @route GET /butterflies/{id}
 * @description Get a specific butterfly by id
 * @param {string} id.path.required - The unique identifier of the butterfly
 * @returns {Butterfly} 200 - Successful response with butterfly
 * @returns {ErrorResponse} 404 - Butterfly not found
 * @throws {Error} - Unexpected error
 */
router.get('/:id', async (req, res) => {
  const db = retrieveDbFromRequest(req);

  /** @type {Butterfly|undefined} */
  const butterfly = await db.get('butterflies')
    .find({ id: req.params.id })
    .value();

  if (!butterfly) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(butterfly);
});

/**
 * @route GET /butterflies
 * @description Get all butterflies
 * @returns {Butterfly[]} 200 - Successful response with butterflies
 * @throws {Error} - Unexpected error
 */
router.get('/', async (req, res) => {
  const db = retrieveDbFromRequest(req);

  const butterflies = await db.get('butterflies')
    .value();

  res.json(butterflies);
});

/**
 * @typedef {Object} ButterflyInput
 * @property {string} commonName - Common name for the butterfly, ex. "Zebra Swallowtail"
 * @property {string} species - Scientific species name of the butterfly, ex. "Protographium marcellus"
 * @property {string} article - URL to article for more information on the butterfly, ex. "https://en.wikipedia.org/wiki/Protographium_marcellus"
 */

/**
 * Create a new butterfly
 * @route POST /butterflies
 * @description Create a new butterfly
 * @param {ButterflyInput} req.body.required - The butterfly input
 * @returns {Butterfly} 201 - Successfully created butterfly
 * @returns {ErrorResponse} 400 - Invalid request body
 * @throws {Error} 500 - Unexpected error
 */
router.post('/', async (req, res) => {
  const db = retrieveDbFromRequest(req);

  try {
    validateButterfly(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const newButterfly = {
    id: nanoid(),
    ...req.body
  };

  await db.get('butterflies')
    .push(newButterfly)
    .write();

  res.status(201).location(`/butterflies/${newButterfly.id}`).json(newButterfly);
});

/**
 * Get all ratings for a butterfly
 * @route GET /butterflies/{id}/ratings
 * @description Get all ratings for a butterfly
 * @param {string} id.path.required - The butterfly id
 * @returns {Rating[]} 200 - All ratings for this butterfly
 * @throws {Error} 500 - Unexpected error
 */
router.get('/:id/ratings', async (req, res) => {
  const db = retrieveDbFromRequest(req);

  /** @type {Butterfly|undefined} */
  const butterfly = await db.get('butterflies')
    .find({ id: req.params.id })
    .value();

  if (!butterfly) {
    return res.status(404).json({ error: 'Not found' });
  }

  const ratings = await db.get('ratings')
    .filter({ butterflyId: req.params.id })
    .orderBy(['rating'], ['desc'])
    .value();

  res.json(ratings);
});

module.exports = router;
