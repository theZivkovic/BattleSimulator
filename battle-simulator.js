const Army = require('./army');
const StrategyChoices = require('./strategyChoices');
const Vehicle = require('./vehicle');
const { ARMY_DEAD } = require('./battle-events');

class BattleSimulator {

    constructor() {
        this._armies = new Map();
        this._armiesCache = new Array();
        this._battleOver = false;
        this._nextArmyID = 0;
        this._nextSquadID = 0;
        this._nextUnitID = 0;
    }

    _getRandomDeffender(attackerArmyID){
        let filteredArmies = this._armiesCache.filter(army => army.getArmyID() != attackerArmyID);
        const randomIndex = Math.floor(Math.random() * filteredArmies.length);
        return filteredArmies[randomIndex];
    }

    addArmy(newArmy) {
        const newArmyID = this._nextArmyID++;
        newArmy._armyID = newArmyID;
        this._armies.set(newArmyID, newArmy);
        this._armiesCache.push(newArmy);
        newArmy.subscribeToEvent(ARMY_DEAD, ({deadArmy}) => {
            console.log('ARMY DIED:', deadArmy._armyID);
            this._armiesCache = this._armiesCache.filter(army => army.getArmyID() != deadArmy._armyID);
            this._armies.delete(deadArmy._armyID);
            if (this._armiesCache.length <= 1){
                console.log('BATTLE FINISHED');
                this._battleOver = true;
            }
        });
        return newArmy;
    }

    addSquadToArmy(targetArmy, newSquad){
        const newSquadID = this._nextSquadID++;
        newSquad._squadID = newSquadID;
        return targetArmy.addSquad(newSquad);
    }

    addUnitToSquad(targetSquad, newUnit){
        const newUnitID = this._nextUnitID++;
        newUnit._unitID = newUnitID;
        return targetSquad.addUnit(newUnit);
    }

    addSoldierToVehicle(targetVehicle, newSoldier){
        if (!targetVehicle instanceof Vehicle)
            throw `BattleSimulator:addUnitToVehicle: targetVehicle must be of type Vehicle`;

        const newUnitID = this._nextUnitID;
        newSoldier._unitID = newUnitID;
        targetVehicle.addSoldier(newSoldier);
        
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

        //console.log('DAMAGE TAKEN IN THIS TURN:', squadCasualties);

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

