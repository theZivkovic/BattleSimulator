const Army = require('./army');

class BattleSimulator {


    constructor() {
        this._armies = new Map();
        this._alliesGraph = new Map();
    }

    addArmy(armyID) {
        this._armies.set(armyID, new Army(armyID));
    }

    setAllies(armyID1, armyID2){
        
        if (!this._armies.get(armyID1) ||
            !this._armies.get(armyID2))
            throw new Error('Both armies must exist in BattleSimulator:setAllies');

        if (!this._alliesGraph.get(armyID1))
            this._alliesGraph.set(armyID1, new Map());

        this._alliesGraph.get(armyID1).set(armyID2, true);

        if (!this._alliesGraph.get(armyID2))
            this._alliesGraph.set(armyID2, new Map());

        this._alliesGraph.get(armyID2).set(armyID1, true);
        console.log(this._alliesGraph);
    }

    deleteAlliance(armyID1, armyID2){
        this._alliesGraph.get(armyID1).delete(armyID2);
        this._alliesGraph.get(armyID2).delete(armyID1);
        console.log(this._alliesGraph);
    }
}

module.exports = BattleSimulator;

