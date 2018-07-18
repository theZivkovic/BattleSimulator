const BattleSimulator = require('../battle-simulator');
const Soldier = require('../soldier');
const Vehicle = require('../vehicle');
const Squad = require('../squad');
const Army = require('../army');
const StrategyChoices = require('../strategy-choices');

const runTestCase = async () => {

    let battleSimulator = new BattleSimulator();
    
    let army0 = battleSimulator.addArmy(new Army());
    let squad0 = battleSimulator.addSquadToArmy(army0, new Squad(StrategyChoices.RANDOM));
    let vehicle0 = battleSimulator.addUnitToSquad(squad0, new Vehicle(100, 2000));
    battleSimulator.addSoldierToVehicle(vehicle0, new Soldier(100, 200, 0));

    let army1 = battleSimulator.addArmy(new Army());
    let squad1 = battleSimulator.addSquadToArmy(army1, new Squad(StrategyChoices.RANDOM));
    let vehicle1 = battleSimulator.addUnitToSquad(squad1, new Vehicle(100, 2000));
    battleSimulator.addSoldierToVehicle(vehicle1, new Soldier(100, 200, 0));
    
    battleSimulator.simulate();
}

module.exports = runTestCase;