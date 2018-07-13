const strategyChoices = require('./strategyChoices');

class Squad {

    constructor(strategy){
        this._units = new Array();
        this._strategy = strategy;
    }

    addUnit(someUnit){
        this._units.push(someUnit);
    }

    computeAttackProb(){
        const attackProbsProduct = this._units.reduce((accum, curUnit) => accum + curUnit.computeAttackProb(), 1.0);
        return Math.pow(attackProbsProduct, 1.0 / this._units.length);
    }

    computeDamage(){
        return this._units.reduce((accum, curUnit) => accum + curUnit);
    }

    isActive(){
        return this._units.some(unit => unit.isActive());
    }
}