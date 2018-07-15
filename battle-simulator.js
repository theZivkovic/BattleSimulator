const Army = require('./army');
const StrategyChoices = require('./strategyChoices');

class BattleSimulator {

    constructor() {
        this._armies = new Map();
        this._armiesCache = new Array();
    }

    _getRandomDeffender(attackerArmyID){
        let filteredArmies = this._armiesCache.filter(army => army.getArmyID() != attackerArmyID);
        const randomIndex = Math.floor(Math.random() * filteredArmies.length);
        return filteredArmies[randomIndex];

    }

    addArmy(armyID, strategy) {
        const newArmy = new Army(armyID, strategy);
        this._armies.set(armyID, newArmy);
        this._armiesCache.push(newArmy);
    }

    addSquadToArmy(armyID, squadID) {
        let targetArmy = this._armies.get(armyID);
        targetArmy.addSquad(squadID, targetArmy.getStrategy());
    }

    addUnitToSquad(armyID, squadID, someUnit){
        let targetArmy = this._armies.get(armyID);
        let targetSquad = targetArmy.getSquad(squadID);
        targetSquad.addUnit(someUnit);
    }

    simulate() {

        this._armies.forEach((attackingArmy) => {

            attackingArmy.forEachSquad((attackingSquad) => {
                
                switch(attackingSquad.getStrategy()){

                    case StrategyChoices.RANDOM: 
                        const targetArmy = this._getRandomDeffender(attackingArmy.getArmyID());
                        const targetSquad = targetArmy.getRandomSquad();
                        
                        let attackerWinProb = attackingSquad.computeAttackProb();
                        let defenderWinProb = targetSquad.computeAttackProb();

                        if (attackerWinProb > defenderWinProb){
                            let damage = attackingSquad.computeDamage();
                            targetSquad.takeDamage(damage);
                        }
                    break;
                }
            });
        });
    }
}

module.exports = BattleSimulator;

