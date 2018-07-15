const strategyChoices = require('./strategyChoices');

class Squad {

    constructor(squadID, strategy){
        this._squadID = squadID;
        this._strategy = strategy;
        this._units = new Array();
    }

    addUnit(someUnit){
        this._units.push(someUnit);
    }

    getStrategy(){
        return this._strategy;
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

    takeDamage(damage){
        let damagePerUnit = damage / this._units.length;
        this._units.forEach((unit) => {
            unit.takeDamage(damagePerUnit);
        });
    }
}

module.exports = Squad;