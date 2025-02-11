var winston = require('winston');
const config = require('config');

winston.add(winston.createLogger({
    level: "debug",// config.logging.level, //config.get('logging.level'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      })
    ),
    transports: [
      new (winston.transports.Console)()
    ]
  }));

  module.exports = winston;
