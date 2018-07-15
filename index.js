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

bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(100, 200, 0));
bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(100, 200, 0));
bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(100, 200, 0));
bs.addUnitToSquad("RED", "RED-INFRANTRY", new Soldier(100, 200, 0));

bs.addSquadToArmy("BLUE", "BLUE-MIXED");

bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.addUnitToSquad("BLUE", "BLUE-MIXED", new Soldier(100, 100, 0));
bs.simulate();
