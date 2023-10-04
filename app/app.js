const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const assignmentRoute = require('./route/assignment-route');
const healthzRoute = require('./route/health-route');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use(assignmentRoute);
app.use(healthzRoute);

module.exports = app;
