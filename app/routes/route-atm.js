import Express from "express";
import { listAll, getAtm, newAtm, editAtm, deleteAtm } from '../controllers/cnt-atm.js';
import { validateToken } from '../controllers/cnt-auth.js';


const express = Express
const router = express.Router();

router.get('/', validateToken ,listAll);
router.get('/:id', validateToken, getAtm);
router.post('/', validateToken, newAtm);
router.put('/:id', validateToken, editAtm);
router.delete('/:id', validateToken, deleteAtm);

export { router }