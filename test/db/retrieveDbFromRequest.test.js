'use strict';

const retrieveDbFromRequest = require('../../src/db/retrieveDbFromRequest');

describe('src/db/retrieveDbFromRequest', () => {
  it('throws error when db is not on request', () => {
    const req = {};
    expect(() => {
      retrieveDbFromRequest(req);
    }).toThrow('Database connection not available');
  });
});
