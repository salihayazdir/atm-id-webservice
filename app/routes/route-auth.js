import Express from "express";
import { postRegister, postLogin, postToken, postAccount, validateToken } from '../controllers/cnt-auth.js';

const express = Express
const router = express.Router();

router.post('/register', postRegister );
router.post('/login', postLogin );
router.post('/token', postToken );
router.post('/account', validateToken, postAccount );

export { router }