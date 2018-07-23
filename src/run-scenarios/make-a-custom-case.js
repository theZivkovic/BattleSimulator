const BattleSimulator = require('../entities/battle-simulator');
const BattleBuilder = require('../builders/battle-builder');

/* This fulfilles the configuration part of the task:
The following constraints should be configurable:
- The number of armies: 2 <= n
- The choice of attack strategy per army: random|weakest|strongest
- The number of squads per army: 2 <= n
The number of units per squad: 5 <= n <= 10 (vehicle is always calculated as a single unit no
matter how many operators it has) */

const runTestCase = async () => {
    let battleSimulator = await (new BattleBuilder()).build();
    console.log('Simulate!');
    battleSimulator.simulate();
}

module.exports = runTestCase;
