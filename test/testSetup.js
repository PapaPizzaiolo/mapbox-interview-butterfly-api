'use strict';

const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const createApp = require('../src/index');

module.exports = async () => {
  // Create a test database
  const testDbPath = path.join(__dirname, 'test.db.json');
  const db = await lowdb(new FileAsync(testDbPath));

  // Fill the test database with data
  await db.setState({
    butterflies: [
      {
        id: 'wxyz9876',
        commonName: 'test-butterfly',
        species: 'Testium butterflius',
        article: 'https://example.com/testium_butterflius'
      },
      {
        id: 'qwertyuio',
        commonName: 'test-butterfly-2',
        species: 'Testium butterflius redux',
        article: 'https://example.com/testium_butterflius_redux'
      }
    ],
    users: [
      {
        id: 'abcd1234',
        username: 'test-user'
      },
      {
        id: 'test-user-2',
        username: 'test-user-2'
      },
      {
        id: 'test-user-3',
        username: 'test-user-3'
      }
    ],
    ratings: [
      {
        id: '9981xwsi',
        userId: 'abcd1234',
        butterflyId: 'qwertyuio',
        rating: 2
      },
      {
        id: '9981xwsy',
        userId: 'test-user-2',
        butterflyId: 'qwertyuio',
        rating: 4
      }
    ]
  }).write();

  // Create an app instance
  process.env.DB_PATH = testDbPath;
  const app = await createApp();
  return app;
};
