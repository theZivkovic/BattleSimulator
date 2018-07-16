const strategyChoices = require('./strategyChoices');
const EventEmmiter = require('events');
const { UNIT_DEAD, SQUAD_DEAD } = require('./battle-events');

class Squad {

    constructor(strategy){
        this._strategy = strategy;
        this._units = new Array();
        this._eventEmmiter = new EventEmmiter();
    }

    getSquadID(){
        return this._squadID;
    }

    getStrategy(){
        return this._strategy;
    }

    addUnit(someUnit){
        this._units.push(someUnit);
        someUnit.subscribeToEvent(UNIT_DEAD, ({deadUnit}) => {
            console.log('Unit died:', deadUnit._unitID);
            this._units = this._units.filter(unit => unit._unitID != deadUnit._unitID);
            if (this._units.length == 0)
                this._eventEmmiter.emit(SQUAD_DEAD, {deadSquad: this});
        });

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

    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }
}

module.exports = Squad;