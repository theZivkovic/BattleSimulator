const strategyChoices = require('./strategyChoices');
const EventEmmiter = require('events');
const { UNIT_DEAD, UNIT_RECHARGED, SQUAD_DEAD } = require('./battle-events');
const { Logger } = require('./logger');

class Squad {

    constructor(strategy){
        this._strategy = strategy;
        this._units = new Array();
        this._rechargedUnitsMap = new Map();
        this._eventEmmiter = new EventEmmiter();
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
            console.log('Unit recharged:', rechargedUnit._unitID);
            this._rechargedUnitsMap.set(rechargedUnit._unitID, true);
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