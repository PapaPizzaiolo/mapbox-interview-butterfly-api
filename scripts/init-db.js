'use strict';

const fs = require('fs');
const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

async function init() {

  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'butterflies.db.json');

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = await lowdb(new FileAsync(dbPath));

  await db.defaults({
    butterflies: [
      { id: 'Hq4Rk_vOPMehRX2ar6LKX', commonName: 'Zebra Swallowtail', species: 'Protographium marcellus', article: 'https://en.wikipedia.org/wiki/Protographium_marcellus' },
      { id: 'H7hhcEWLDsxyHN0cnDrBV', commonName: 'Plum Judy', species: 'Abisara echerius', article: 'https://en.wikipedia.org/wiki/Abisara_echerius' },
      { id: 'VJ5v4ZEQVL92XaaSl7xgD', commonName: 'Red Pierrot', species: 'Talicada nyseus', article: 'https://en.wikipedia.org/wiki/Talicada_nyseus' },
      { id: 'juX-MCpw0NUW1xh40xgVc', commonName: 'Texan Crescentspot', species: 'Anthanassa texana', article: 'https://en.wikipedia.org/wiki/Anthanassa_texana' },
      { id: 'HIoGrnyIiUeIvAyhaYpit', commonName: 'Guava Skipper', species: 'Phocides polybius', article: 'https://en.wikipedia.org/wiki/Phocides_polybius' },
      { id: 'HlvjJBL8BLw2HFETsr9Sv', commonName: 'Mexican Bluewing', species: 'Myscelia ethusa', article: 'https://en.wikipedia.org/wiki/Myscelia_ethusa' }
    ],
    users: [
      { id: '-9aAFuyNIkpSzRMNux2BQ', username: 'iluvbutterflies' },
      { id: '15rKqk4vDp7V5vE1MYG3t', username: 'flutterby' },
      { id: '2rWtjZcs88ElPfRSSL3Zm', username: 'metamorphosize_me' }
    ],
    ratings: [
      { id: 'UlKit1k8I1jNZUm4Tpy1B', userId: '-9aAFuyNIkpSzRMNux2BQ', butterflyId: 'HIoGrnyIiUeIvAyhaYpit', rating: 0 },
      { id: 'Xk9Lm2nO3pQr4sT5uV6wY', userId: '-9aAFuyNIkpSzRMNux2BQ', butterflyId: 'Hq4Rk_vOPMehRX2ar6LKX', rating: 5 },
      { id: 'A1b2C3d4E5f6G7h8I9j0K', userId: '-9aAFuyNIkpSzRMNux2BQ', butterflyId: 'H7hhcEWLDsxyHN0cnDrBV', rating: 4 },
      { id: 'L1m2N3o4P5q6R7s8T9u0V', userId: '15rKqk4vDp7V5vE1MYG3t', butterflyId: 'VJ5v4ZEQVL92XaaSl7xgD', rating: 3 },
      { id: 'W1x2Y3z4A5b6C7d8E9f0G', userId: '15rKqk4vDp7V5vE1MYG3t', butterflyId: 'juX-MCpw0NUW1xh40xgVc', rating: 5 },
      { id: 'H1i2J3k4L5m6N7o8P9q0R', userId: '15rKqk4vDp7V5vE1MYG3t', butterflyId: 'HIoGrnyIiUeIvAyhaYpit', rating: 2 },
      { id: 'S1t2U3v4W5x6Y7z8A9b0C', userId: '2rWtjZcs88ElPfRSSL3Zm', butterflyId: 'HlvjJBL8BLw2HFETsr9Sv', rating: 4 },
      { id: 'D1e2F3g4H5i6J7k8L9m0N', userId: '2rWtjZcs88ElPfRSSL3Zm', butterflyId: 'Hq4Rk_vOPMehRX2ar6LKX', rating: 3 },
      { id: 'O1p2Q3r4S5t6U7v8W9x0Y', userId: '2rWtjZcs88ElPfRSSL3Zm', butterflyId: 'H7hhcEWLDsxyHN0cnDrBV', rating: 5 },
      { id: 'Z1a2B3c4D5e6F7g8H9i0J', userId: '-9aAFuyNIkpSzRMNux2BQ', butterflyId: 'VJ5v4ZEQVL92XaaSl7xgD', rating: 4 },
      { id: 'K1l2M3n4O5p6Q7r8S9t0U', userId: '15rKqk4vDp7V5vE1MYG3t', butterflyId: 'Hq4Rk_vOPMehRX2ar6LKX', rating: 5 },
      { id: 'V1w2X3y4Z5a6B7c8D9e0F', userId: '2rWtjZcs88ElPfRSSL3Zm', butterflyId: 'juX-MCpw0NUW1xh40xgVc', rating: 2 }
    ]
  }).write();
}

if (require.main === module) {
  (async () => await init())();
}
