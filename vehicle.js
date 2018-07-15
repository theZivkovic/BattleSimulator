const Unit = require('./unit');
const Constants = require('./constants');
const { UNIT_DEAD } = require('./battle-events');

class Vehicle extends Unit {

    constructor(unitID, health, rechargeTime) {
        // TO-DO - add constraint for recharge (>1000ms)
        super(unitID, health, rechargeTime);
        this._soldiers = new Array();
    }

    addSoldier(someSoldier){
        // TO-DO - add limit constraints
        this._soldiers.push(someSoldier);
    }

    _totalHealth() {
        const totalSoldiersHP = this._soldiers.reduce((accum, currentSoldier) => accum + currentSoldier._health, 0.0);
        return totalSoldiersHP / this._soldiers.length + this._health;
    }

    computeAttackProb() {
        const attackProbsProduct = this._soldiers.reduce((accum, curSoldier) => accum + curSoldier.computeAttackProb(), 1.0);
        const attackProbsGeomAvg =  Math.pow(attackProbsProduct, 1.0 / this._soldiers.length);
        return Constants.VEHICLE_ATTACK_PONDER * (1.0 + this._health / Constants.VEHICLE_HEALTH_NORMALIZER) * attackProbsGeomAvg; 
    }

    computeDamage(){
        const totalSoldiersXP = this._soldiers.reduce((accum, curSoldier) => accum + curSoldier._experience, 0.0);
        return Constants.VEHICLE_MIN_DAMAGE + totalSoldiersXP / Constants.VEHICLE_OPERATOR_XP_NORMALIZER;
    }

    isActive() {
        const someSoldierAlive = this._soldiers.some(soldier => soldier.isActive());
        return someSoldierAlive && this._health >= 0;
    }

    takeDamage(damage){
        
        this._health -= damage * Constants.VEHICLE_DAMAGE_INTAKE;
        
        if (this._soldiers.length > 0){

            let randomIndex = Math.random() * this._soldiers.length;
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

        //if (this._totalHealth() <= 0) {
            // check if the vehicle is dead and signal to higher instances
            this._eventEmmiter.emit(UNIT_DEAD, {});
        //}
    }
}

module.exports = Vehicle;