const express = require('express');
const app = express();
const router = express.Router();

const checkdb = require('../controllers/cnt-db');

router.get('/', checkdb);
  
module.exports = router