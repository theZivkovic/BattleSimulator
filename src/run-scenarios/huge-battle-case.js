const BattleSimulator = require('../entities/battle-simulator');
const Soldier = require('../entities/soldier');
const Vehicle = require('../entities/vehicle');
const Squad = require('../entities/squad');
const Army = require('../entities/army');
const StrategyChoices = require('../enums/strategy-choices');

const runTestCase = async () => {

    let battleSimulator = new BattleSimulator();
    
    let redArmy = battleSimulator.addArmy(new Army());
    
    let redInfrantrySquad = battleSimulator.addSquadToArmy(redArmy, new Squad(StrategyChoices.WEAKEST));
    battleSimulator.addUnitToSquad(redInfrantrySquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(redInfrantrySquad, new Soldier(100, 150, 0));
    battleSimulator.addUnitToSquad(redInfrantrySquad, new Soldier(100, 200, 0));
    battleSimulator.addUnitToSquad(redInfrantrySquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(redInfrantrySquad, new Soldier(100, 150, 0));
    battleSimulator.addUnitToSquad(redInfrantrySquad, new Soldier(100, 200, 0));

    let redHeavyInfrantrySquad = battleSimulator.addSquadToArmy(redArmy, new Squad(StrategyChoices.STRONGEST));
    battleSimulator.addUnitToSquad(redHeavyInfrantrySquad, new Soldier(100, 500, 10));
    battleSimulator.addUnitToSquad(redHeavyInfrantrySquad, new Soldier(100, 550, 10));
    battleSimulator.addUnitToSquad(redHeavyInfrantrySquad, new Soldier(100, 500, 10));
    battleSimulator.addUnitToSquad(redHeavyInfrantrySquad, new Soldier(100, 500, 10));
    battleSimulator.addUnitToSquad(redHeavyInfrantrySquad, new Soldier(100, 500, 10));

    let whiteArmy = battleSimulator.addArmy(new Army());
    
    let whiteArmyLightSquad = battleSimulator.addSquadToArmy(whiteArmy, new Squad(StrategyChoices.RANDOM));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));
    battleSimulator.addUnitToSquad(whiteArmyLightSquad, new Soldier(100, 100, 0));

    let whiteTanksSquad = battleSimulator.addSquadToArmy(whiteArmy, new Squad(StrategyChoices.STRONGEST));
    let whiteTank0 = battleSimulator.addUnitToSquad(whiteTanksSquad, new Vehicle(100, 1500));
    battleSimulator.addSoldierToVehicle(whiteTank0, new Soldier(100, 100, 1));

    let blackArmy = battleSimulator.addArmy(new Army());
    
    let blackPanzerSquad = battleSimulator.addSquadToArmy(blackArmy, new Squad(StrategyChoices.STRONGEST));
    
    let blackPanzer0 = battleSimulator.addUnitToSquad(blackPanzerSquad, new Vehicle(100, 1000));
    battleSimulator.addSoldierToVehicle(blackPanzer0, new Soldier(100, 100, 1));
    battleSimulator.addSoldierToVehicle(blackPanzer0, new Soldier(100, 100, 1));
    battleSimulator.addSoldierToVehicle(blackPanzer0, new Soldier(100, 100, 1));
    let blackPanzer1 = battleSimulator.addUnitToSquad(blackPanzerSquad, new Vehicle(100, 1000));
    battleSimulator.addSoldierToVehicle(blackPanzer1, new Soldier(100, 100, 1));
    battleSimulator.addSoldierToVehicle(blackPanzer1, new Soldier(100, 100, 1));
    battleSimulator.addSoldierToVehicle(blackPanzer1, new Soldier(100, 100, 1));
    let blackPanzer2 = battleSimulator.addUnitToSquad(blackPanzerSquad, new Vehicle(100, 1000));
    battleSimulator.addSoldierToVehicle(blackPanzer2, new Soldier(100, 100, 1));
    battleSimulator.addSoldierToVehicle(blackPanzer2, new Soldier(100, 100, 1));
    battleSimulator.addSoldierToVehicle(blackPanzer2, new Soldier(100, 100, 1));

    battleSimulator.simulate();
}

module.exports = runTestCase;