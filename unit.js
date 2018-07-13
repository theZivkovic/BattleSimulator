class Unit {

    constructor(health, rechargeTime){
        this._health = health;
        this._rechargeTIme = rechargeTime;
    }

    computeAttackProb() {
        throw new Error(`You have to implement method ${this.computeAttackProb.name} in all subclasses of Unit class`);
    }

    computeDamage() {
        throw new Error(`You have to implement method ${this.computeDamage.name} in all subclasses of Unit class`);
    }

    isActive() {
        throw new Error(`You have to implement method ${this.isActive.name} in all subclasses of Unit class`);
    }
}

module.exports = Unit;