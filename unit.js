const EventEmmiter = require('events');

class Unit {

    constructor(unitID, health, rechargeTime){
        this._unitID = unitID;
        this._health = health;
        this._rechargeTIme = rechargeTime;
        this._eventEmmiter = new EventEmmiter();
    }

    getUnitID(){
        return this._unitID;
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

    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }



}

module.exports = Unit;