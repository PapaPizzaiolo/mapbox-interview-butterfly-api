'use strict';

const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');

let dbInstance = null;

const initializeDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'butterflies.db.json');
  const adapter = new FileAsync(dbPath);

  try {
    const db = await lowdb(adapter);
    await db.read();

    dbInstance = db;
    return db;
  } catch (error) {
    console.error(`Failed to initialize database, check ${dbPath}`, error);
    throw error;
  }
};

module.exports = initializeDb;
