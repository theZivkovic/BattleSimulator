const questionUtil = require('./questionUtil');
const Soldier = require('./soldier');
const Vehicle = require('./vehicle');
const Army = require('./army');
const Squad = require('./squad');
const BattleSimulator = require('./battle-simulator');
const StrategyChoices = require('./strategyChoices');
const Logger = require('./logger');
let bs = new BattleSimulator();

const redArmy = bs.addArmy(new Army(StrategyChoices.RANDOM));
const redInfrantry = bs.addSquadToArmy(redArmy, new Squad(StrategyChoices.RANDOM));
bs.addUnitToSquad(redInfrantry, new Soldier(100, 200, 5));
bs.addUnitToSquad(redInfrantry, new Soldier(100, 200, 5));
bs.addUnitToSquad(redInfrantry, new Soldier(100, 200, 5));
bs.addUnitToSquad(redInfrantry, new Soldier(100, 200, 5));
bs.addUnitToSquad(redInfrantry, new Soldier(100, 200, 5));
bs.addUnitToSquad(redInfrantry, new Soldier(100, 200, 5));
const vehicle = bs.addUnitToSquad(redInfrantry, new Vehicle(100, 1500));
bs.addSoldierToVehicle(vehicle, new Soldier(100, 200, 10));
bs.addSoldierToVehicle(vehicle, new Soldier(100, 200, 11));


const blueArmy = bs.addArmy(new Army(StrategyChoices.RANDOM));
const blueInfrantry = bs.addSquadToArmy(blueArmy, new Squad(StrategyChoices.RANDOM));
bs.addUnitToSquad(blueInfrantry, new Soldier(100, 200, 0));
bs.addUnitToSquad(blueInfrantry, new Soldier(100, 200, 0));
bs.simulate();


