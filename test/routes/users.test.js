'use strict';

const request = require('supertest');
const { nanoid } = require('nanoid');
const testSetup = require('../testSetup');

jest.mock('nanoid');

let app;

beforeAll(async () => {
  app = await testSetup();
});

describe('GET user', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/users/abcd1234');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'abcd1234',
      username: 'test-user'
    });
  });

  it('error - not found', async () => {
    const response = await request(app)
      .get('/users/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });
});

describe('GET user ratings', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/users/abcd1234/ratings');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        butterflyId: 'qwertyuio',
        id: '9981xwsi',
        rating: 2,
        userId: 'abcd1234'
      }
    ]);
  });

  it('fails for missing user', async () => {
    const response = await request(app)
      .get('/users/klslsl/ratings');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });

  it('empty array for no ratings', async () => {
    const response = await request(app)
      .get('/users/test-user-3/ratings');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('POST user', () => {
  it('success', async () => {
    nanoid.mockReturnValue('new-user-id');

    const postResponse = await request(app)
      .post('/users')
      .send({
        username: 'Buster'
      });

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });

    const getResponse = await request(app)
      .get('/users/new-user-id');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });
  });

  it('error - empty body', async () => {
    const response = await request(app)
      .post('/users')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/users')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });
});
