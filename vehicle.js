const Unit = require('./unit');
const Constants = require('./constants');
const { UNIT_DEAD } = require('./battle-events');
const { Logger } = require('./logger');

class Vehicle extends Unit {

    constructor(health, rechargeTime) {
        super(health, rechargeTime);
        
        if (rechargeTime < 1000)
            throw new Error('Vehicle::constructor: rechargeTime must be in [100-2000] interval');
            
        this._soldiers = new Array();
    }

    addSoldier(someSoldier){
        this._soldiers.push(someSoldier);
    }

    _totalSoldiersHP() {
        const totalSoldiersHP = this._soldiers.reduce((accum, currentSoldier) => accum + currentSoldier._health, 0.0);
        return totalSoldiersHP / this._soldiers.length;
    }

    totalHealth(){
        return this._totalSoldiersHP() + this._health;
    }

    experiencePerUnit() {
        let totalExperience = this._soldiers.reduce((accum, currentSoldier) => accum + currentSoldier._experience, 0.0);
        return totalExperience / this._soldiers.length;
    }

    totalNumberOfRelatedUnits(){
        return this._soldiers.length + 1;
    }

    computeAttackProb() {
        const attackProbsProduct = this._soldiers.reduce((accum, curSoldier) => accum * curSoldier.computeAttackProb(), 1.0);
        const attackProbsGeomAvg =  Math.pow(attackProbsProduct, 1.0 / this._soldiers.length);
        return Constants.VEHICLE_ATTACK_PONDER * (1.0 + this._health / Constants.VEHICLE_HEALTH_NORMALIZER) * attackProbsGeomAvg; 
    }

    computeDamage(){
        const totalSoldiersXP = this._soldiers.reduce((accum, curSoldier) => accum + curSoldier._experience, 0.0);
        return Constants.VEHICLE_MIN_DAMAGE + totalSoldiersXP / Constants.VEHICLE_OPERATOR_XP_NORMALIZER;
    }

    isActive() {
        const someSoldierAlive = this._soldiers.some(soldier => soldier.isActive());
        return someSoldierAlive && this._health > 0;
    }

    takeDamage(damage){
        
        this._health -= damage * Constants.VEHICLE_DAMAGE_INTAKE;

        Logger.logUnit(this, `took damage of ${Constants.VEHICLE_DAMAGE_INTAKE} * ${damage.toFixed(2)} damage (the rest goes to soldiers), has ${this._health.toFixed(2)} HPs left`);

        if (this._soldiers.length > 0){

            let randomIndex = Math.floor(Math.random() * this._soldiers.length);
            let randomSoldier = this._soldiers[randomIndex];
            randomSoldier.takeDamage( damage * Constants.MAIN_SOLDIER_DAMAGE_INTAKE );

            let restOfDamage = damage * Constants.OTHER_SOLDIERS_DAMAGE_INTAKE;
            let restOfSoldiersNo = this._soldiers.length - 1;
            let damagePerSoldier = restOfDamage / restOfSoldiersNo;

            this._soldiers.forEach((soldier, soldierIndex) => {
                if (soldierIndex != randomIndex)
                    soldier.takeDamage(damagePerSoldier);
            });
        }

        // check if the vehicle is dead and signal it to the higher instances
        if (!this.isActive()) {
            this._eventEmmiter.emit(UNIT_DEAD, {deadUnit: this});
        }
    }

    increaseExperience(){
        this._soldiers.forEach((soldier) => {
            soldier.increaseExperience();
        });
    }
}

module.exports = Vehicle;