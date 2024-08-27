'use strict';

const initializeDb = require('./init');

const attachDbToRequest = async (req, res, next) => {
  try {
    const db = await initializeDb();
    req.db = db;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = attachDbToRequest;
