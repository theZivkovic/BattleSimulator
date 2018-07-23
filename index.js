const { Logger, LoggerOutput } = require('./src/utils/logger');
Logger.initialize(LoggerOutput.TO_CONSOLE);

//const runTestCase = require('./run-scenarios/make-a-custom-case');
//const runTestCase = require('./run-scenarios/heavy-machinery-case');
//const runTestCase = require('./run-scenarios/minimal-test-case');
const runTestCase = require('./src/run-scenarios/huge-battle-case');

runTestCase();
