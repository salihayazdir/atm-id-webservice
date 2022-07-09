const express = require('express');
const router = express.Router();

const { listAll, getAtm, newAtm, editAtm, deleteAtm } = require('../controllers/cnt-atm');

router.get('/', listAll);
router.get('/:id', getAtm);
router.post('/', newAtm);
router.put('/:id', editAtm);
router.delete('/:id', deleteAtm);

module.exports = router