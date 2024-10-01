const express = require('express');
const { getStates } = require('../controllers/stateController');

const router = express.Router();

router.get('/estados', getStates);

module.exports = router;
