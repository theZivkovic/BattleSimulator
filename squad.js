const strategyChoices = require('./strategyChoices');
const EventEmmiter = require('events');
const { UNIT_DEAD, UNIT_RECHARGED, SQUAD_DEAD, SQUAD_RECHARGED } = require('./battle-events');
const { Logger } = require('./logger');

class Squad {

    constructor(strategy){
        this._strategy = strategy;
        this._units = new Array();

        // holds the IDs of the currently fully recharged units
        this._rechargedUnitsMap = new Map();
        this._eventEmmiter = new EventEmmiter();
    }

    tellImReadyForTheAttack(){
        this._eventEmmiter.emit(SQUAD_RECHARGED, {rechargedSquad: this});
    }

    getSquadID(){
        return this._squadID;
    }

    getStrategy(){
        return this._strategy;
    }

    increaseExperience(){
        this._units.forEach(unit => {
            unit.increaseExperience();
        });
    }

    isRechargedForTheAttack() {
        return this._rechargedUnitsMap.size === this._units.length;
    }

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

    computeAttackProb(){
        const attackProbsProduct = this._units.reduce((accum, curUnit) => accum + curUnit.computeAttackProb(), 1.0);
        return Math.pow(attackProbsProduct, 1.0 / this._units.length);
    }

    computeDamage(){
        return this._units.reduce((accum, curUnit) => accum + curUnit.computeDamage(), 0.0);
    }

    isActive(){
        return this._units.some(unit => unit.isActive());
    }

    takeDamage(damage){
        let damagePerUnit = damage / this._units.length;
        this._units.forEach((unit) => {
            unit.takeDamage(damagePerUnit);
        });
    }

    restartRechargeTimers(){
        this._units.forEach((unit) => {
            unit.restartRechargeTimer();
        });
        this._rechargedUnitsMap.clear();
    }

    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }
}

module.exports = Squad;