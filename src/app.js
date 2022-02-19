const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require("path");
// Database connection
require("./helpers/databaseConnection");
// require('./helpers/redisConnection');

// Initialize server
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(`${__dirname}/api/crContent/files`)));
// App routes
app.use(routes);

module.exports = app;
