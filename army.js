class Army {

    constructor(armyID) {
        this._squads = new Array();
        this._armyID = armyID;
    }

    addSquad(someSquad){
        this._squads.push(someSquad);
    }

    getArmyID() {
        return this._armyID;
    }
}

module.exports = Army;
