const questionUtil = require('./questionUtil');
const Soldier = require('./soldier');
const Vehicle = require('./vehicle');
const Army = require('./army');
const Squad = require('./squad');
const BattleSimulator = require('./battle-simulator');
const StrategyChoices = require('./strategyChoices');
let bs = new BattleSimulator();

bs.addArmy('RED', StrategyChoices.RANDOM);
bs.addArmy('BLUE', StrategyChoices.STRONGEST);

bs.addSquadToArmy("RED", "RED-INFRANTRY");
bs.addSquadToArmy("RED", "RED-TANKS");

bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(0, 100, 200, 0));
bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(1, 100, 200, 0));
bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(2, 100, 200, 0));
bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(3, 100, 200, 0));

bs.addUnitToSquad("RED", "RED-TANKS", new Vehicle(100, 2000, 1500));
bs.addUnitToSquad("RED", "RED-TANKS", new Vehicle(101, 2000, 1500));
bs.addUnitToSquad("RED", "RED-TANKS", new Vehicle(102, 2000, 1500));
bs.addUnitToSquad("RED", "RED-TANKS", new Vehicle(103, 2000, 1500));
bs.addUnitToSquad("RED", "RED-TANKS", new Vehicle(104, 2000, 1500));
bs.addUnitToSquad("RED", "RED-TANKS", new Vehicle(105, 2000, 1500));

bs.addSquadToArmy("BLUE", "BLUE-MIXED");

bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Vehicle(9, 2000, 1500));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Vehicle(10, 2000, 1500));

bs.simulate();
