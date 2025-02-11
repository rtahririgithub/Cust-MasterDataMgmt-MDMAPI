'use strict';

const http = require('http');
const config = require('config');
const terminus = require('@godaddy/terminus');
const express = require('express');
const greeting = require('./greet/greeting');
const logger = require('./util/log');
const actuator = require('./util/actuator');
const partyRouter = require('./routes/partyRouter')
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
var morgan = require('morgan')
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
//const HOST = '127.0.0.1';
const VERSION = config.get('server.contextPath');
const CONTEXTROOT = VERSION;

logger.debug(`Version=${VERSION}`);
// App
const app = express();

app.use(morgan('combined'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./middleware/tokenValidation'));

app.use(CONTEXTROOT, greeting);

app.use(CONTEXTROOT, actuator);

//main route here
app.use(`${CONTEXTROOT}/partyManagement`, partyRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  logger.error(err.stack)
  res.status(400).send({
    code: 0,
    reason: "Missing Mandatory Input Parameter"
  });
})

const server = http.createServer(app);

function onSignal() {
  logger.debug('server is starting cleanup');
  // start cleanup of resource, like databases or file descriptors
}

async function onHealthCheck() {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
}

terminus(server, {
  signal: 'SIGINT',
   healthChecks: {
    [`${VERSION}/health`]: onHealthCheck,
  },
  onSignal
});

if(process.env.NODE_CONFIG_ENV === 'localdev'){
  dotenv.config();
}

server.listen(PORT, HOST);
logger.info(`Running on http://${HOST}:${PORT}`);


module.exports = server;

