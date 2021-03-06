const Soldier = require('../entities/soldier');
const Vehicle = require('../entities/vehicle');
const Army = require('../entities/army');
const Squad = require('../entities/squad');
const BattleSimulator = require('../entities/battle-simulator');
const StrategyChoices = require('../enums/strategy-choices');
const { askAQuestion, askAQuestionUntilRight}  = require('../utils/question-util');
const Constants = require('../config/constants');

const util = require('util')

/* Helps building the instance of BattleSimulator in some user-friendly way */
class BattleBuilder {

    constructor() {

    }

    async build() {

        // clear the battle simulator 
        this._battleSimulator = null;

        // clear the blueprint. This object will store
        // the answers retrieved from the builder
        this._blueprint = {};

        // generate the blueprint...
        await this._generateBlueprintByQuestions();

        //..and use it to configure the simulation
        return await this._generateBattleFromBlueprint();
    }

    async _generateBlueprintByQuestions() {
        
        const noArmies = await askAQuestionUntilRight(
            'Number of armies:\n',
            answer => Number(answer) >= Constants.MIN_NUMBER_OF_ARMIES,
            `Wrong number of armies, should be >= ${Constants.MIN_NUMBER_OF_ARMIES}!`
        );

        this._blueprint.armies = new Array(noArmies);

        for (let armyIndex = 0; armyIndex < noArmies; armyIndex++) {
            
            const strategy = await askAQuestionUntilRight(
                `Strategy for Army#${armyIndex}:\n1.${StrategyChoices.RANDOM}\n2.${StrategyChoices.WEAKEST}\n3.${StrategyChoices.STRONGEST}\n`,
                answer => Number(answer) >= 1 && Number(answer) <= 3,
                `Option out of bounds!`
            );

            this._blueprint.armies[armyIndex] = {};

            switch(Number(strategy)){
                case 1: this._blueprint.armies[armyIndex].strategy = StrategyChoices.RANDOM; break;
                case 2: this._blueprint.armies[armyIndex].strategy = StrategyChoices.WEAKEST; break;
                case 3: this._blueprint.armies[armyIndex].strategy = StrategyChoices.STRONGEST; break;
            }

            const noSquads = await askAQuestionUntilRight(
                `Number of squads for Army#${armyIndex}:\n`,
                answer => Number(answer) >= Constants.MIN_NUMBER_OF_SQUADS_PER_ARMY,
                `Wrong number of squads per army, should be >= ${Constants.MIN_NUMBER_OF_SQUADS_PER_ARMY}!`
            );

            this._blueprint.armies[armyIndex].squads = new Array(Number(noSquads));

            for (let squadIndex = 0; squadIndex < noSquads; squadIndex++){

                const noSoldiers = await askAQuestionUntilRight(
                    `Number of soldiers for Army#${armyIndex}#Squad${squadIndex}? Beware, total number of soldiers+vehicles is restricted to `  +
                    `${Constants.MIN_NUMBER_OF_UNITS_PER_SQUAD} - ${Constants.MAX_NUMBER_OF_UNITS_PER_SQUAD} per squad:\n`,
                    answer => Number(answer) >= Constants.MIN_NUMBER_OF_UNITS_PER_SQUAD && Number(answer) <= Constants.MAX_NUMBER_OF_UNITS_PER_SQUAD,
                    'Number of soldiers out of range!');

                this._blueprint.armies[armyIndex].squads[squadIndex] = {};

                this._blueprint.armies[armyIndex].squads[squadIndex].soldiers = Number(noSoldiers);

                if (noSoldiers == Constants.MAX_NUMBER_OF_UNITS_PER_SQUAD)
                    continue;

                const noVehicles = await askAQuestionUntilRight(
                        `Number of vehicles for Army#${armyIndex}#Squad${squadIndex}:\n`,
                        answer => Number(answer) + Number(noSoldiers) >= Constants.MIN_NUMBER_OF_UNITS_PER_SQUAD &&
                                  Number(answer) + Number(noSoldiers) <= Constants.MAX_NUMBER_OF_UNITS_PER_SQUAD,
                        'Number of vehicles out of range!');

                this._blueprint.armies[armyIndex].squads[squadIndex].vehicles = new Array(Number(noVehicles));

                for (let vehicleIndex = 0; vehicleIndex < noVehicles; vehicleIndex++){

                    const noSoldiers = await askAQuestionUntilRight(
                        `Number of soldiers for Army#${armyIndex}#Squad${squadIndex}#Vehicle${vehicleIndex}, should be between ` +
                        `${Constants.MIN_NUMBER_OF_SOLDIERS_PER_VEHICLE} and ${Constants.MAX_NUMBER_OF_SOLDIERS_PER_VEHICLE}\n`,
                        answer => Number(answer) >= Constants.MIN_NUMBER_OF_SOLDIERS_PER_VEHICLE && Number(answer) <= Constants.MAX_NUMBER_OF_SOLDIERS_PER_VEHICLE ,
                        `Wrong number soldiers in this vehicle!`
                    );

                    this._blueprint.armies[armyIndex].squads[squadIndex].vehicles[vehicleIndex] = { soldiers: Number(noSoldiers) };
                }
            }
        }
    }

    async _generateBattleFromBlueprint() {
        
        const newBattleSimulator = new BattleSimulator();

        this._blueprint.armies.forEach((armyBlueprint) => {
            let newArmy = newBattleSimulator.addArmy(new Army());
            let newArmyStrategy = armyBlueprint.strategy;
            armyBlueprint.squads.forEach((squadBlueprint) => {
                let newSquad = newBattleSimulator.addSquadToArmy(newArmy, new Squad(newArmyStrategy));
                for (let soldierIndex = 0; soldierIndex < squadBlueprint.soldiers; soldierIndex++){
                    newBattleSimulator.addUnitToSquad(newSquad, new Soldier(100, 200, 0));
                }
                for (let vehicleBlueprint of squadBlueprint.vehicles){
                    let newVehicle = newBattleSimulator.addUnitToSquad(newSquad, new Vehicle(100, 1000));
                    for (let operatorIndex = 0; operatorIndex < vehicleBlueprint.soldiers; operatorIndex++){
                        newBattleSimulator.addSoldierToVehicle(newVehicle, new Soldier(100, 200, 0));
                    }
                }
            });
        });

        return newBattleSimulator;
    }
}

module.exports = BattleBuilder;