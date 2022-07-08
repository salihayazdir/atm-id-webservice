const express = require('express');
const app = express();
const router = express.Router();

const { atmAddNew } = require('../controllers/cnt-atm');

router.post('/', atmAddNew);

module.exports = router