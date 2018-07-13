const Unit = require('./unit');
const { geomAvg } = require('./mathUtil');

class Vehicle extends Unit {

    constructor(health, rechargeTime) {
        // TO-DO - add constraint for recharge (>1000ms)
        super(health, rechargeTime);
        this._soldiers = new Array();
    }

    addSoldier(someSoldier){
        // TO-DO - add limit constraints
        this._soldiers.push(someSoldier);
    }

    _totalHealth() {
        const totalSoldiersHP = this._soldiers.reduce((accum, current) => accum + current);
        return totalSoldiersHP / this._soldiers.length + this._health;
    }

    computeAttackProb() {
        const attackProbsProduct = this._soldiers.reduce((accum, curSoldier) => accum + curSoldier.computeAttackProb(), 1.0);
        const attackProbsGeomAvg =  Math.pow(attackProbsProduct, 1.0 / this._soldiers.length);
        return 0.5 * (1 + this._health / 100.0) * attackProbsGeomAvg; 
    }


    computeDamage(){
        const totalSoldiersXP = this._soldiers.reduce((accum, curSoldier) => accum + curSoldier._experience);
        return 0.1 + totalSoldiersXP / 100.0;
    }

    isActive() {
        const someSoldierAlive = this._soldiers.some(soldier => soldier.isActive());
        return someSoldierAlive && this._health >= 0;
    }

    // implement the case when the vehicle is killed - all operators should be killed
}

module.exports = Vehicle;