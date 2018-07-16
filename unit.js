const EventEmmiter = require('events');
const { UNIT_RECHARGED } = require('./battle-events');

class Unit {

    constructor(health, rechargeTime){
        this._health = health;
        this._rechargeTime = rechargeTime;
        this._eventEmmiter = new EventEmmiter();
        this._recharged = true;
    }

    restartRechargeTimer(){
        this._recharged = false;
        setTimeout(() => {
            this._recharged = true;
            this._eventEmmiter.emit(UNIT_RECHARGED, {rechargedUnit: this});
        }, this._rechargeTime);
    }

    isRecharged(){
        return this._recharged;
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

    takeDamage(damage) {
        throw new Error(`You have to implement method ${this.takeDamage.name} in all subclasses of Unit class`);
    }

    increaseExperience(){
        throw new Error(`You have to implement method ${this.increaseExperience.name} in all subclasses of Unit class`);
    }

    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }



}

module.exports = Unit;