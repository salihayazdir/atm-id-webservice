const express = require("express");
const cors = require("cors");
const app = express();

// var corsOptions = { origin: false };
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});
 
const atm = require('./app/routes/route-atm.js')
app.use('/atm', atm)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});