const Squad = require('./squad');

class Army {

    constructor(armyID, strategy) {
        this._armyID = armyID;
        this._strategy = strategy;
        this._squads = new Map();
        this._squadsCache = new Array();
    }

    addSquad(squadID){
        const newSquad = new Squad(squadID, this._strategy);
        this._squads.set(squadID, newSquad);
        this._squadsCache.push(newSquad);
    }

    getSquad(squadID){
        return this._squads.get(squadID);
    }

    getRandomSquad(){
        let randomIndex = Math.floor(Math.random() * this._squadsCache.length);
        return this._squadsCache[randomIndex];
    }

    forEachSquad(callback){
        this._squads.forEach(callback);
    }

    getArmyID() {
        return this._armyID;
    }

    getStrategy(){
        return this._strategy;
    }
}

module.exports = Army;
