const Unit = require('./unit');
const Constants = require('./constants');
const { randomInRange } = require('./mathUtil');
const { UNIT_DEAD } = require('./battle-events');

class Soldier extends Unit {

    constructor(health, rechargeTime, experience){
        super(health, rechargeTime);
        this._experience = experience;
    }

    computeAttackProb() {
        const healthPart = Constants.SOLDIER_ATTACK_PONDER * (1.0 + this._health / Constants.SOLDIER_HEALTH_NORMALIZER);
        const expPart = randomInRange(Constants.SOLIDER_ATTACK_MIN_EXP_GAIN + this._experience, Constants.SOLDIER_ATTACK_MAX_EXP_GAIN) / Constants.SOLDIER_EXP_NORMALIZER;
        return healthPart * expPart;
    }

    computeDamage(){
        return Constants.SOLDIER_MIN_DAMAGE + this._experience / Constants.SOLDIER_DAMAGE_EXP_PONDER;
    }

    isActive(){
        return this._health >= 0;
    }

    takeDamage(damage){

        this._health -= damage;
        if (!this.isActive()) {
            // check if the soldier is dead and signal it to the higher instances
            this._eventEmmiter.emit(UNIT_DEAD, {deadUnit: this});            
        }
    }
}

module.exports = Soldier;