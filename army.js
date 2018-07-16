const EventEmmiter = require('events');
const { Logger } = require('./logger');
const Squad = require('./squad');
const { SQUAD_DEAD, ARMY_DEAD } = require('./battle-events');

class Army {

    constructor(strategy) {
        this._strategy = strategy;
        this._squads = new Map();
        this._squadsCache = new Array();
        this._nextSquadID = 0;
        this._eventEmmiter = new EventEmmiter();
    }

    getArmyID(){
        return this._armyID;
    }

    addSquad(newSquad){
        const newSquadID = newSquad._squadID;
        this._squads.set(newSquadID, newSquad);
        this._squadsCache.push(newSquad);
        newSquad._armyID = this._armyID;
        newSquad.subscribeToEvent(SQUAD_DEAD, ({deadSquad}) => {
            Logger.logSquad(deadSquad, 'died!');
            this._squadsCache = this._squadsCache.filter(squad => squad.getSquadID() != deadSquad._squadID);
            this._squads.delete(deadSquad._squadID);
            if (this._squadsCache.length == 0)
                this._eventEmmiter.emit(ARMY_DEAD, {deadArmy: this});
        });
        return newSquad;
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
