const BattleSimulator = require('../battle-simulator');
const BattleBuilder = require('../battle-builder');

const runTestCase = async () => {
    let battleSimulator = await (new BattleBuilder()).build();
    console.log('Simulate!');
    battleSimulator.simulate();
}

module.exports = runTestCase;
