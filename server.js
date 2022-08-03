import Express from "express";
import cors from 'cors'
import {router as atm} from './app/routes/route-atm.js';
import {router as auth} from './app/routes/route-auth.js';
import { getMembers } from "./app/controllers/cnt-atm.js";

const express = Express
const app = express();

// var corsOptions = { origin: false };
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.use('/atm', atm)
app.use('/auth', auth)

app.get('/members', getMembers);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});