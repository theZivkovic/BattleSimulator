const EventEmmiter = require('events');
const Squad = require('./squad');
const { SQUAD_DEAD, ARMY_DEAD } = require('./battle-events');

class Army {

    constructor(armyID, strategy) {
        this._armyID = armyID;
        this._strategy = strategy;
        this._squads = new Map();
        this._squadsCache = new Array();
        this._eventEmmiter = new EventEmmiter();
    }

    getArmyID(){
        return this._armyID;
    }

    addSquad(squadID){
        const newSquad = new Squad(squadID, this._strategy);
        this._squads.set(squadID, newSquad);
        this._squadsCache.push(newSquad);
        newSquad.subscribeToEvent(SQUAD_DEAD, () => {
            console.log('SQUAD DEAD:', newSquad.getSquadID());
            this._squadsCache = this._squadsCache.filter(squad => squad.getSquadID() != squadID);
            this._squads.delete(squadID);
            if (this._squadsCache.length == 0)
                this._eventEmmiter.emit(ARMY_DEAD, {});
        });
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

    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }
}

module.exports = Army;
