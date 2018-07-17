const EventEmmiter = require('events');
const { UNIT_RECHARGED } = require('./battle-events');

class Unit {

    constructor(health, rechargeTime){
        this._health = health;
        this._rechargeTime = rechargeTime;
        this._eventEmmiter = new EventEmmiter();
    }

    restartRechargeTimer(){
        setTimeout(() => {
            this._eventEmmiter.emit(UNIT_RECHARGED, {rechargedUnit: this});
        }, this._rechargeTime);
    }

    totalHealth(){
        throw new Error(`You have to implement method ${this.totalHealth.name} in all subclasses of Unit class`);
    }

    experiencePerUnit() {
        throw new Error(`You have to implement method ${this.experiencePerUnit.name} in all subclasses of Unit class`);
    }

    totalNumberOfRelatedUnits(){
        throw new Error(`You have to implement method ${this.totalNumberOfRelatedUnits.name} in all subclasses of Unit class`);
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