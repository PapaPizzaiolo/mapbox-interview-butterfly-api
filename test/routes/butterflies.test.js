'use strict';

const request = require('supertest');
const { nanoid } = require('nanoid');
const testSetup = require('../testSetup');

jest.mock('nanoid');

let app;

beforeAll(async () => {
  app = await testSetup();
});

describe('GET butterfly', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/butterflies/wxyz9876');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'wxyz9876',
      commonName: 'test-butterfly',
      species: 'Testium butterflius',
      article: 'https://example.com/testium_butterflius'
    });
  });

  it('error - not found', async () => {
    const response = await request(app)
      .get('/butterflies/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });
});

describe('GET butterflies', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/butterflies');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      {
        id: 'wxyz9876',
        commonName: 'test-butterfly',
        species: 'Testium butterflius',
        article: 'https://example.com/testium_butterflius'
      },
      {
        article: 'https://example.com/testium_butterflius_redux',
        commonName: 'test-butterfly-2',
        id: 'qwertyuio',
        species: 'Testium butterflius redux'
      }
    ]));
  });
});

describe('GET butterfly ratings', () => {
  it('empty array when no ratings', async () => {
    const response = await request(app)
      .get('/butterflies/wxyz9876/ratings');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('not found when missing butterfly', async () => {
    const response = await request(app)
      .get('/butterflies/aksksk/ratings');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });

  it('success', async () => {
    const response = await request(app)
      .get('/butterflies/qwertyuio/ratings');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      {
        butterflyId: 'qwertyuio',
        id: '9981xwsy',
        rating: 4,
        userId: 'test-user-2'
      },
      {
        butterflyId: 'qwertyuio',
        id: '9981xwsi',
        rating: 2,
        userId: 'abcd1234'
      }
    ]));

    const ratings = response.body.map((item) => item.rating);
    const sortedRatings = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sortedRatings);
  });
});

describe('POST butterfly', () => {
  it('success', async () => {
    nanoid.mockReturnValue('new-butterfly-id');

    const postResponse = await request(app)
      .post('/butterflies')
      .send({
        commonName: 'Boop',
        species: 'Boopi beepi',
        article: 'https://example.com/boopi_beepi'
      });

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toEqual({
      id: 'new-butterfly-id',
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi'
    });

    const getResponse = await request(app)
      .get('/butterflies/new-butterfly-id');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-butterfly-id',
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi'
    });
  });

  it('error - empty body', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing some attributes', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send({ commonName: 'boop' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });
});

