const EventEmmiter = require('events');
const { UNIT_RECHARGED } = require('../enums/battle-events');

class Unit {

    constructor(health, rechargeTime){

        if (health < 0 || health > 100)
            throw new Error('Unit::constructor: health must be in [0-100] interval');
        
        if (rechargeTime < 100 || rechargeTime > 2000)
            throw new Error('Unit::constructor: rechargeTime must be in [100-2000] interval');

        this._health = health;
        this._rechargeTime = rechargeTime;
        this._eventEmmiter = new EventEmmiter();
    }

    /* Starts recharging and emits and event when it finishes */
    restartRechargeTimer(){
        setTimeout(() => {
            this._eventEmmiter.emit(UNIT_RECHARGED, {rechargedUnit: this});
        }, this._rechargeTime);
    }

    /* Total health of units owned by this unit (own health, children health) */
    totalHealth(){
        throw new Error(`You have to implement method ${this.totalHealth.name} in all subclasses of Unit class`);
    }

    /* Avg experience of units owned by this unit (own exp, children exp) */
    experiencePerUnit() {
        throw new Error(`You have to implement method ${this.experiencePerUnit.name} in all subclasses of Unit class`);
    }

     /* Total number of units owned by this unit, including themselves */
    totalNumberOfRelatedUnits(){
        throw new Error(`You have to implement method ${this.totalNumberOfRelatedUnits.name} in all subclasses of Unit class`);
    }

    /* Compute the probability of the attack */
    computeAttackProb() {
        throw new Error(`You have to implement method ${this.computeAttackProb.name} in all subclasses of Unit class`);
    }

    /* Compute the damage */
    computeDamage() {
        throw new Error(`You have to implement method ${this.computeDamage.name} in all subclasses of Unit class`);
    }

    /* Check if this unit is alive */
    isActive() {
        throw new Error(`You have to implement method ${this.isActive.name} in all subclasses of Unit class`);
    }

    /* Recieve some damage */
    takeDamage(damage) {
        throw new Error(`You have to implement method ${this.takeDamage.name} in all subclasses of Unit class`);
    }

    /* Increase experience for this unit (and child units, if present) */
    increaseExperience(){
        throw new Error(`You have to implement method ${this.increaseExperience.name} in all subclasses of Unit class`);
    }

    /* Listen to events - used by upper management classes to listen for the unit events */
    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }



}

module.exports = Unit;