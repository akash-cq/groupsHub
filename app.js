const express = require('express');
const app = express();
require('dotenv').config();

const path = require("path");
const routes = require('./routes/Routes');
const mongo = require("./Connect")
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const secret = process.env.SECRET_KEY;
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: secret,
  })
);
mongo();
app.use(express.json())
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(path.join(__dirname, "view", "css")));
app.use("/js", express.static(path.join(__dirname, "view", "js")));
app.use("/", routes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});