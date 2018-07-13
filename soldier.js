const Unit = require('./unit');
const { randomInRange } = require('./mathUtil');

class Soldier extends Unit {

    constructor(health, rechargeTime, experience){
        super(health, rechargeTime);
        this._experience = experience;
    }

    computeAttackProb() {
        return 0.5 * (1.0 + this._health / 100.0) * randomInRange(30.0 + this._experience, 100.0) / 100.0;
    }

    computeDamage(){
        return 0.05 + this._experience / 100.0;
    }

    isActive(){
        return this._health >= 0;
    }
}

module.exports = Soldier;