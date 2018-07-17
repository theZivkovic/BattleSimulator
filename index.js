const BattleSimulator = require('./battle-simulator');
const BattleBuilder = require('./battle-builder');
const { Logger, LoggerOutput } = require('./logger');

Logger.initialize(LoggerOutput.TO_CONSOLE);

const run = async () => {
    let battleSimulator = await (new BattleBuilder()).build();
    console.log('Simulate!');
    battleSimulator.simulate();
}

run();


