'use strict';

const router = require('express').Router();

router.use('/butterflies', require('./butterflies'));
router.use('/ratings', require('./ratings'));
router.use('/users', require('./users'));

module.exports = router;
