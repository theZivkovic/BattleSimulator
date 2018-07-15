const Army = require('./army');
const StrategyChoices = require('./strategyChoices');
const { ARMY_DEAD } = require('./battle-events');

class BattleSimulator {

    constructor() {
        this._armies = new Map();
        this._armiesCache = new Array();
        this._battleOver = false;
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
        newArmy.subscribeToEvent(ARMY_DEAD, () => {
            console.log('ARMY DIED:', armyID);
            this._armiesCache = this._armiesCache.filter(army => army.getArmyID() != armyID);
            this._armies.delete(armyID);
            if (this._armiesCache.length <= 1){
                console.log('BATTLE FINISHED');
                this._battleOver = true;
            }
        });
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

    _simulateOneTurn() {

        let squadCasualties = new Map();

        // calculate damage taken by each squad
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
                            let previousSquadDamage = squadCasualties.get(targetSquad.getSquadID()) || 0.0;
                            squadCasualties.set(targetSquad.getSquadID(), previousSquadDamage + damage);
                        }
                    break;
                }
            });
        });

        console.log('DAMAGE TAKEN IN THIS TURN:', squadCasualties);

        // apply damage to each squad
        this._armies.forEach((damagedArmy) => {
            damagedArmy.forEachSquad((damagedSquad) => {
                let damageTakenBySquad = squadCasualties.get(damagedSquad.getSquadID());
                if (!damageTakenBySquad)
                    return;
                damagedSquad.takeDamage(damageTakenBySquad);
            });
        });
    }

    simulate() {
        while(!this._battleOver)
            this._simulateOneTurn();
    }
}

module.exports = BattleSimulator;

