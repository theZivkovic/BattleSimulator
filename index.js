const { Logger, LoggerOutput } = require('./logger');
Logger.initialize(LoggerOutput.TO_CONSOLE);

//const runTestCase = require('./test-cases/make-a-custom-case');
const runTestCase = require('./test-cases/minimal-test-case');

runTestCase();
