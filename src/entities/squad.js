const EventEmmiter = require('events');
const strategyChoices = require('../enums/strategy-choices');
const { UNIT_DEAD, UNIT_RECHARGED, SQUAD_DEAD, SQUAD_RECHARGED } = require('../enums/battle-events');
const { Logger } = require('../utils/logger');

class Squad {

    constructor(strategy){
        this._strategy = strategy;
        this._units = new Array();

        // holds the IDs of the currently fully recharged units
        this._rechargedUnitsMap = new Map();
        this._eventEmmiter = new EventEmmiter();
    }

    // Tell the higher classes that this squad is ready for battle */
    tellImReadyForTheAttack(){
        this._eventEmmiter.emit(SQUAD_RECHARGED, {rechargedSquad: this});
    }

    getSquadID(){
        return this._squadID;
    }

    getStrategy(){
        return this._strategy;
    }

    /* Increase experience recursively */
    increaseExperience(){
        this._units.forEach(unit => {
            unit.increaseExperience();
        });
    }

    /* Checks whether the squad is recharged or not */
    isRechargedForTheAttack() {
        return this._rechargedUnitsMap.size === this._units.length;
    }

    /* Add unit to squad, assign some ids to it */
    addUnit(someUnit){
        
        this._units.push(someUnit);
        someUnit._squadID = this._squadID;
        someUnit._armyID = this._armyID;

        someUnit.subscribeToEvent(UNIT_DEAD, ({deadUnit}) => {
            Logger.logUnit(deadUnit, 'died!');
            this._units = this._units.filter(unit => unit._unitID != deadUnit._unitID);
            if (this._units.length == 0)
                this._eventEmmiter.emit(SQUAD_DEAD, {deadSquad: this});
        });

        someUnit.subscribeToEvent(UNIT_RECHARGED, ({rechargedUnit}) => {
            Logger.logUnit(rechargedUnit, 'recharged and ready for battle');
            this._rechargedUnitsMap.set(rechargedUnit._unitID, true);
            if (this.isRechargedForTheAttack())
                this._eventEmmiter.emit(SQUAD_RECHARGED, {rechargedSquad: this});
        });

        this._rechargedUnitsMap.set(someUnit._unitID, true);
        return someUnit;
    }

    /* Compute the attack probability - used for measuring if one squad will hit or miss the other */
    computeAttackProb(){
        const attackProbsProduct = this._units.reduce((accum, curUnit) => accum * curUnit.computeAttackProb(), 1.0);
        return Math.pow(attackProbsProduct, 1.0 / this._units.length);
    }

    /* Compute the total damage given by this squad */
    computeDamage(){
        return this._units.reduce((accum, curUnit) => accum + curUnit.computeDamage(), 0.0);
    }

    /* Compute the squad's strength, so that it can be compared to other squads */
    computeSquadStrength(){
        let totalHealth = this._units.reduce((accum, curUnit) => accum + curUnit.totalHealth(), 0.0);
        let experiencePerUnit = this._units.reduce((accum, curUnit) => accum + curUnit.experiencePerUnit(), 0.0) / this._units.length;
        let numberOfUnits = this._units.reduce((accum, curUnit) => accum + curUnit.totalNumberOfRelatedUnits(), 0.0);
        let totalDamage = this._units.reduce((accum, curUnit) => accum + curUnit.computeDamage(), 0.0);
        return totalHealth * experiencePerUnit * numberOfUnits * totalDamage;

    }

    /* Check if squad is alive */
    isActive(){
        return this._units.some(unit => unit.isActive());
    }

    /* Receive some damage and trigger damage recieving in its units */
    takeDamage(damage){
        let damagePerUnit = damage / this._units.length;
        Logger.logSquad(this, `took ${damage.toFixed(2)} damage, ${damagePerUnit.toFixed(2)} per unit`);
        this._units.forEach((unit) => {
            unit.takeDamage(damagePerUnit);
        });
    }

    /* Restart recharging of its units */
    restartRechargeTimers(){
        this._units.forEach((unit) => {
            unit.restartRechargeTimer();
        });
        this._rechargedUnitsMap.clear();
    }
    
    /* Listen to events - used by upper management classes to listen for the unit events */
    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }
}

module.exports = Squad;