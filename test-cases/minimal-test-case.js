const BattleSimulator = require('../battle-simulator');
const Soldier = require('../soldier');
const Vehicle = require('../vehicle');
const Squad = require('../squad');
const Army = require('../army');
const StrategyChoices = require('../strategyChoices');

const runTestCase = async () => {

    let battleSimulator = new BattleSimulator();
    
    let army0 = battleSimulator.addArmy(new Army());
    let squad0 = battleSimulator.addSquadToArmy(army0, new Squad(StrategyChoices.RANDOM));
    battleSimulator.addUnitToSquad(squad0, new Soldier(100, 25, 0));
    battleSimulator.addUnitToSquad(squad0, new Soldier(100, 25, 0));

    let army1 = battleSimulator.addArmy(new Army());
    let squad1 = battleSimulator.addSquadToArmy(army1, new Squad(StrategyChoices.RANDOM));
    battleSimulator.addUnitToSquad(squad1, new Soldier(100, 50, 5));

    battleSimulator.simulate();
}

module.exports = runTestCase;