const BattleSimulator = require('../entities/battle-simulator');
const Soldier = require('../entities/soldier');
const Vehicle = require('../entities/vehicle');
const Squad = require('../entities/squad');
const Army = require('../entities/army');
const StrategyChoices = require('../enums/strategy-choices');

const runTestCase = async () => {

    let battleSimulator = new BattleSimulator();
    
    let army0 = battleSimulator.addArmy(new Army());
    let squad0 = battleSimulator.addSquadToArmy(army0, new Squad(StrategyChoices.RANDOM));
    battleSimulator.addUnitToSquad(squad0, new Soldier(100, 200, 1));
    battleSimulator.addUnitToSquad(squad0, new Soldier(100, 200, 0));

    let army1 = battleSimulator.addArmy(new Army());
    let squad1 = battleSimulator.addSquadToArmy(army1, new Squad(StrategyChoices.RANDOM));
    battleSimulator.addUnitToSquad(squad1, new Soldier(100, 200, 1));
    battleSimulator.addUnitToSquad(squad1, new Soldier(100, 200, 1));
    battleSimulator.simulate();
}

module.exports = runTestCase;