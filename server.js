const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();

// var corsOptions = { origin: "http://localhost:8081" };
// app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('api/main/miv-api/v1', router)

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

const db = require('./app/routes/route-db')
app.use('/db', db)

const atm = require('./app/routes/route-atm.js')
app.use('/atm', atm)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});