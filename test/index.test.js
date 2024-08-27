'use strict';

const request = require('supertest');
const testSetup = require('./testSetup');

let app;

beforeAll(async () => {
  app = await testSetup();
});

describe('GET root', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Server is running!'
    });
  });
});
