const { Logger } = require('../utils/logger');
const StrategyChoices = require('../enums/strategy-choices');
const { ARMY_DEAD, SQUAD_RECHARGED } = require('../enums/battle-events');
const Army = require('./army');
const Vehicle = require('./vehicle');

/* The main class that manages and runs the simulation */
class BattleSimulator {

    constructor() {

        // for quick retreaval of armies
        this._armies = new Map();

        // for iterating over armies
        this._armiesCache = new Array();
        
        // indicator of the battle's end        
        this._battleOver = false;

        // this class manages the IDs of all entities, so
        // each entity creation must go through this class
        this._nextArmyID = 0;
        this._nextSquadID = 0;
        this._nextUnitID = 0;
    }

    /* Get random army different from the one with attackerArmyID */
    _getRandomDeffender(attackerArmyID){
        let filteredArmies = this._armiesCache.filter(army => army.getArmyID() != attackerArmyID);
        const randomIndex = Math.floor(Math.random() * filteredArmies.length);
        return filteredArmies[randomIndex];
    }

    /* Get the strongest squad which is not in the attackers army */
    _getStrongestDeffenderSquad(attackerArmyID){
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

    /* Get the weakest squad which is not in the attackers army */
    _getWeakestDeffenderSquad(attackerArmyID){
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

    /* Add army to the simulator, assign ID to it, subscribe for its events */
    addArmy(newArmy) {
        const newArmyID = this._nextArmyID++;
        newArmy._armyID = newArmyID;
        this._armies.set(newArmyID, newArmy);
        this._armiesCache.push(newArmy);
        newArmy.subscribeToEvent(ARMY_DEAD, ({deadArmy}) => {
            Logger.logArmy(deadArmy, 'died!');
            this._armiesCache = this._armiesCache.filter(army => army.getArmyID() != deadArmy._armyID);
            this._armies.delete(deadArmy._armyID);
            if (this._armiesCache.length <= 1) {
                this._battleOver = true;
                Logger.logArmy(this._armiesCache[0], 'won the battle!');
                Logger.logArmyStats(this._armiesCache[0]);
                console.log('BATTLE OVER!');
            }
        });
        return newArmy;
    }

    /* Adds a squad to an army that is already in the simulation, assigns ID to it
    and subscribes for relevant events */
    addSquadToArmy(targetArmy, newSquad){
        const newSquadID = this._nextSquadID++;
        newSquad._squadID = newSquadID;
        newSquad._armyID = targetArmy._armyID;
        newSquad.subscribeToEvent(SQUAD_RECHARGED, ({rechargedSquad}) => {
            if (!this._battleOver)
                this.attackWithSquad(rechargedSquad);
        });
        return targetArmy.addSquad(newSquad);
    }

    /* Adds a unit to a squad that is already in the simulation, assigns ID to it */
    addUnitToSquad(targetSquad, newUnit){
        const newUnitID = this._nextUnitID++;
        newUnit._unitID = newUnitID;
        return targetSquad.addUnit(newUnit);
    }

    /* Adds a soldier to a vehicle that is already in the simulation, assigns ID to it */
    addSoldierToVehicle(targetVehicle, newSoldier){
        if (!targetVehicle instanceof Vehicle)
            throw `BattleSimulator:addUnitToVehicle: targetVehicle must be of type Vehicle`;

        const newUnitID = this._nextUnitID;
        newSoldier._unitID = newUnitID;
        newSoldier._squadID = targetVehicle._squadID;
        newSoldier._armyID = targetVehicle._armyID;
        targetVehicle.addSoldier(newSoldier);
        
    }

    /* Do the attack with the specified squad. Choose the target based on strategy, try to deal
    a damage and go into recharge */
    attackWithSquad(attackingSquad){
       
        if (this._battleOver)
            return;

        Logger.logSquad(attackingSquad, 'ready for attack!');

        let targetSquad = null;

        switch(attackingSquad.getStrategy()){
            
            case StrategyChoices.RANDOM: 
                const targetArmy = this._getRandomDeffender(attackingSquad._armyID);
                targetSquad = targetArmy.getRandomSquad();
                break;
            
            case StrategyChoices.STRONGEST:
                targetSquad = this._getStrongestDeffenderSquad(attackingSquad._armyID);
                break;
            
            case StrategyChoices.WEAKEST:
                targetSquad = this._getWeakestDeffenderSquad(attackingSquad._armyID);
                break;
        }

        let attackerWinProb = attackingSquad.computeAttackProb();
        let defenderWinProb = targetSquad.computeAttackProb();

        if (attackerWinProb > defenderWinProb){
            let damage = attackingSquad.computeDamage();
            targetSquad.takeDamage(damage);
            attackingSquad.increaseExperience();
            Logger.logSquad(attackingSquad, `attacked enemy squad, dealth ${damage.toFixed(2)} damage.`);
        }
        else 
        {
            Logger.logSquad(attackingSquad, `missed the enemy squad! ${attackerWinProb.toFixed(2)} < ${defenderWinProb.toFixed(2)}`);
        }
        attackingSquad.restartRechargeTimers();
    }

    /* The main simulation event loop. This triggers events across the whole
    hierarchy */
    simulate() {
        this._armiesCache.forEach((army) => {
            army.forEachSquad((squad) => {
                squad.tellImReadyForTheAttack();
            });
        });
    }
}

module.exports = BattleSimulator;

