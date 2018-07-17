const { Logger } = require('./logger');
const Army = require('./army');
const StrategyChoices = require('./strategyChoices');
const Vehicle = require('./vehicle');
const { ARMY_DEAD, SQUAD_RECHARGED } = require('./battle-events');

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

    _getStrongestDeffender(attackerArmyID){
        return this._armiesCache.reduce((lastStrongestSquad, currentArmy) => {
            if (currentArmy._armyID != attackerArmyID && !lastStrongestSquad)
                return currentArmy.getStrongestSquad();
            
            if (!lastStrongestSquad)
                return null;

            let currentStrongestSquad = currentArmy.getStrongestSquad();
            return currentStrongestSquad.computeSquadStrength() > lastStrongestSquad.computeSquadStrength() ?
                currentStrongestSquad : lastStrongestSquad; 
        }, null);
    }

    _getWeakestDeffender(attackerArmyID){
        return this._armiesCache.reduce((lastWeakestSquad, currentArmy) => {
            if (currentArmy._armyID != attackerArmyID && !lastWeakestSquad)
                return currentArmy.getWeakestSquad();
            
            if (!lastWeakestSquad)
                return null;

            let currentWeakestSquad = currentArmy.getWeakestSquad();
            return currentWeakestSquad.computeSquadStrength() < lastWeakestSquad.computeSquadStrength() ?
                currentWeakestSquad : lastWeakestSquad; 
        }, null);
    }

    addArmy(newArmy) {
        const newArmyID = this._nextArmyID++;
        newArmy._armyID = newArmyID;
        this._armies.set(newArmyID, newArmy);
        this._armiesCache.push(newArmy);
        newArmy.subscribeToEvent(ARMY_DEAD, ({deadArmy}) => {
            Logger.logArmy(deadArmy, 'died!');
            this._armiesCache = this._armiesCache.filter(army => army.getArmyID() != deadArmy._armyID);
            this._armies.delete(deadArmy._armyID);
            if (this._armiesCache.length <= 1){
                Logger.logArmy(this._armiesCache[0], 'won the battle!');
                console.log('BATTLE OVER!');
                this._battleOver = true;
            }
        });
        return newArmy;
    }

    addSquadToArmy(targetArmy, newSquad){
        const newSquadID = this._nextSquadID++;
        newSquad._squadID = newSquadID;
        newSquad._armyID = targetArmy._armyID;
        newSquad.subscribeToEvent(SQUAD_RECHARGED, ({rechargedSquad}) => {
            this.attackWithSquad(rechargedSquad);
        });
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
        newSoldier._squadID = targetVehicle._squadID;
        newSoldier._armyID = targetVehicle._armyID;
        targetVehicle.addSoldier(newSoldier);
        
    }

    attackWithSquad(attackingSquad){
       
        Logger.logSquad(attackingSquad, 'ready for attack!');

        let targetSquad = null;

        switch(attackingSquad.getStrategy()){
            
            case StrategyChoices.RANDOM: 
                const targetArmy = this._getRandomDeffender(attackingSquad._armyID);
                targetSquad = targetArmy.getRandomSquad();
                break;
            
            case StrategyChoices.STRONGEST:
                targetSquad = this._getStrongestDeffender(attackingSquad._armyID);
                break;
            
            case StrategyChoices.WEAKEST:
                targetSquad = this._getWeakestDeffender(attackingSquad._armyID);
                break;
        }

        let attackerWinProb = attackingSquad.computeAttackProb();
        let defenderWinProb = targetSquad.computeAttackProb();

        if (attackerWinProb > defenderWinProb){
            let damage = attackingSquad.computeDamage();
            targetSquad.takeDamage(damage);
            attackingSquad.restartRechargeTimers();
            attackingSquad.increaseExperience();
            Logger.logSquad(attackingSquad, `attacked enemy squad, dealth ${damage} damage`);
        }
        else {
            Logger.logSquad(attackingSquad, `missed the enemy squad!`);
        }
    }

    simulate() {
        this._armiesCache.forEach((army) => {
            army.forEachSquad((squad) => {
                squad.tellImReadyForTheAttack();
            });
        });
    }
}

module.exports = BattleSimulator;

