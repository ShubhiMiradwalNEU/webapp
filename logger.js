const { createLogger, format, transports } = require("winston");

const customFormat = format.combine(format.timestamp(), format.printf((object) => {
  return `${object.timestamp} [${object.level.toUpperCase().padEnd(6)}]: ${object.message}`
}))
  
const logger = createLogger({
    level: 'debug',
    format: customFormat,
    transports: [
        new transports.Console({level: 'silly'}),
        new transports.File({ filename: './logs/webapp.log',level: 'info'}),
    ],
  });
module.exports = logger ;