const strategyChoices = require('./strategyChoices');
const { SOLDIER_DEAD, VEHICLE_DEAD } = require('./battle-events');

class Squad {

    constructor(squadID, strategy){
        this._squadID = squadID;
        this._strategy = strategy;
        this._units = new Array();
    }

    addUnit(someUnit){
        this._units.push(someUnit);
        someUnit.subscribeToEvent(SOLDIER_DEAD, () => {
            console.log('SOLDIER DEAD', someUnit.getUnitID());
            this._units = this._units.filter(unit => unit.getUnitID() == someUnit.getUnitID());
        });
        someUnit.subscribeToEvent(VEHICLE_DEAD, () => {
            console.log('VEHICLE DEAD', someUnit.getUnitID());
            this._units = this._units.filter(unit => unit.getUnitID() == someUnit.getUnitID());
        });
    }

    getStrategy(){
        return this._strategy;
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
}

module.exports = Squad;