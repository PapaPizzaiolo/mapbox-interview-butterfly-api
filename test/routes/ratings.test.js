'use strict';

const request = require('supertest');
const { nanoid } = require('nanoid');
const testSetup = require('../testSetup');

jest.mock('nanoid');

let app;

beforeAll(async () => {
  app = await testSetup();
});

describe('POST rating', () => {
  it('success', async () => {
    nanoid.mockReturnValue('new-rating-id');

    const postResponse = await request(app)
      .post('/ratings')
      .send({
        butterflyId: 'wxyz9876',
        userId: 'abcd1234',
        rating: 2
      });
    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toEqual({
      id: 'new-rating-id',
      butterflyId: 'wxyz9876',
      userId: 'abcd1234',
      rating: 2
    });
  });

  it('invalid rating', async () => {
    const postResponse = await request(app)
      .post('/ratings')
      .send({
        butterflyId: 'wxyz9876',
        userId: 'abcd1234',
        rating: 6
      });
    expect(postResponse.status).toBe(400);
    expect(postResponse.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('invalid user', async () => {
    const response = await request(app)
      .post('/ratings')
      .send({
        butterflyId: 'wxy9876',
        userId: 'bad-user',
        rating: 2
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'User not found'
    });
  });

  it('invalid butterfly', async () => {
    const response = await request(app)
      .post('/ratings')
      .send({
        butterflyId: 'bad-butterfly',
        userId: 'abcd1234',
        rating: 2
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Butterfly not found'
    });
  });
});

describe('PUT rating', () => {
  it('success', async () => {
    const putResponse = await request(app)
      .put('/ratings/9981xwsi')
      .send({
        butterflyId: 'qwertyuio',
        userId: 'abcd1234',
        rating: 4
      });
    expect(putResponse.status).toBe(200);
    expect(putResponse.body).toEqual({
      id: '9981xwsi',
      butterflyId: 'qwertyuio',
      userId: 'abcd1234',
      rating: 4
    });
  });

  it('fails for invalid rating', async () => {
    const putResponse = await request(app)
      .put('/ratings/9981xwsi')
      .send({
        butterflyId: 'qwertyuio',
        userId: 'abcd1234',
        rating: 10
      });

    expect(putResponse.status).toBe(400);
    expect(putResponse.body).toEqual({
      error: 'Invalid rating. Must be a number between 0 and 5.'
    });
  });

  it('not found for missing rating', async () => {
    const response = await request(app)
      .put('/ratings/fsad11')
      .send({
        butterflyId: 'qwertyuio',
        userId: 'abcd1234',
        rating: 5
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Rating not found'
    });
  });
});

describe('DELETE rating', () => {
  it('error if not found', async () => {
    const response = await request(app)
      .delete('/ratings/9sik9izi');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Rating not found'
    });
  });

  it('success', async () => {
    nanoid.mockReturnValue('new-rating-id-to-delete');

    const postResponse = await request(app)
      .post('/ratings')
      .send({
        butterflyId: 'wxyz9876',
        userId: 'abcd1234',
        rating: 4
      });
    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toEqual({
      id: 'new-rating-id-to-delete',
      butterflyId: 'wxyz9876',
      userId: 'abcd1234',
      rating: 4
    });

    const response = await request(app)
      .delete('/ratings/new-rating-id-to-delete');
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});



describe('GET rating', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/ratings/9981xwsi');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      butterflyId: 'qwertyuio',
      id: '9981xwsi',
      rating: 4,
      userId: 'abcd1234'
    });
  });

  it('not found for missing rating', async () => {
    const response = await request(app)
      .get('/ratings/nkjsdk9812');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Rating not found'
    });
  });
});
