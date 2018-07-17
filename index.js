const questionUtil = require('./questionUtil');
const Soldier = require('./soldier');
const Vehicle = require('./vehicle');
const Army = require('./army');
const Squad = require('./squad');
const BattleSimulator = require('./battle-simulator');
const StrategyChoices = require('./strategyChoices');

const BattleBuilder = require('./battle-builder');

const { Logger, LoggerOutput } = require('./logger');
Logger.initialize(LoggerOutput.TO_CONSOLE);

// let bs = new BattleSimulator();

// const redArmy = bs.addArmy(new Army());
// const redInfrantry = bs.addSquadToArmy(redArmy, new Squad(StrategyChoices.WEAKEST));
// bs.addUnitToSquad(redInfrantry, new Soldier(200, 200, 5));
// bs.addUnitToSquad(redInfrantry, new Soldier(200, 120, 5));

// const blueArmy = bs.addArmy(new Army(StrategyChoices.RANDOM));
// const blueInfrantry = bs.addSquadToArmy(blueArmy, new Squad(StrategyChoices.RANDOM));
// bs.addUnitToSquad(blueInfrantry, new Soldier(100, 200, 0));
// bs.addUnitToSquad(blueInfrantry, new Soldier(100, 200, 0));
// const blueVehicle = bs.addUnitToSquad(blueInfrantry, new Vehicle(100, 1000));
// bs.addSoldierToVehicle(blueVehicle, new Soldier(100, 200, 0));

// bs.simulate();

let battleBuilder = new BattleBuilder();
battleBuilder.initialize();


