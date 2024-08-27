'use strict';

const retrieveDbFromRequest = (req) => {
  if (!req.db) {
    throw new Error('Database connection not available');
  }
  return req.db;
};

module.exports = retrieveDbFromRequest;
