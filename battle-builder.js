const Soldier = require('./soldier');
const Vehicle = require('./vehicle');
const Army = require('./army');
const Squad = require('./squad');
const BattleSimulator = require('./battle-simulator');
const StrategyChoices = require('./strategyChoices');
const { askAQuestion, askAQuestionUntilRight}  = require('./questionUtil');
const Constants = require('./constants');

const util = require('util')

class BattleBuilder {

    constructor() {
        this._battleSimulator = new BattleSimulator();
        this._blueprint = {};
    }

    async initialize() {

        const noArmies = await askAQuestionUntilRight(
            'Number of armies:\n',
            answer => Number(answer) >= Constants.MIN_NUMBER_OF_ARMIES,
            `Wrong number of armies, should be >= ${Constants.MIN_NUMBER_OF_ARMIES}!`
        );

        this._blueprint.armies = new Array(noArmies);

        for (let armyIndex = 0; armyIndex < noArmies; armyIndex++) {
            
            const noSquads = await askAQuestionUntilRight(
                `Number of squads for Army#${armyIndex}:\n`,
                answer => Number(answer) >= Constants.MIN_NUMBER_OF_SQUADS_PER_ARMY,
                `Wrong number of squads per army, should be >= ${Constants.MIN_NUMBER_OF_SQUADS_PER_ARMY}!`
            );

            this._blueprint.armies[armyIndex] = { squads: Array(Number(noSquads)) };

            for (let squadIndex = 0; squadIndex < noSquads; squadIndex++){

                const noSoldiers = await askAQuestionUntilRight(
                    `Number of soldiers for Army#${armyIndex}#Squad${squadIndex}? Beware, total number of soldiers+vehicles is restricted to `  +
                    `${Constants.MIN_NUMBER_OF_UNITS_PER_SQUAD} - ${Constants.MAX_NUMBER_OF_UNITS_PER_SQUAD} per squad:\n`,
                    answer => Number(answer) >= Constants.MIN_NUMBER_OF_UNITS_PER_SQUAD && Number(answer) <= Constants.MAX_NUMBER_OF_UNITS_PER_SQUAD,
                    'Number of soldiers out of range!');

                this._blueprint.armies[armyIndex].squads[squadIndex] = { soldiers : noSoldiers };

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

                    this._blueprint.armies[armyIndex].squads[squadIndex].vehicles[vehicleIndex] = { soldiers: noSoldiers };
                }
            }
        }
        console.log(util.inspect(this._blueprint, false, null))
    }
}

module.exports = BattleBuilder;