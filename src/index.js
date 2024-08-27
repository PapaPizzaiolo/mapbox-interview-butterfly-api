'use strict';

const express = require('express');

const attachDbToRequest = require('./db/attachDbToRequest');
const routes = require('./routes');
const db = require('./db');

async function createApp() {
  db.init();

  const app = express();
  app.use(express.json());

  app.use(attachDbToRequest);

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  app.use(routes);

  return app;
}

/* istanbul ignore if */
if (require.main === module) {
  (async () => {
    const app = await createApp();
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Butterfly API started at http://localhost:${port}`);
    });
  })();
}

module.exports = createApp;
