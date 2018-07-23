const EventEmmiter = require('events');
const { Logger } = require('../utils/logger');
const Squad = require('./squad');
const { SQUAD_DEAD, ARMY_DEAD } = require('../enums/battle-events');

class Army {

    constructor() {

        // for the fast retriveal of the squad
        this._squads = new Map();

        // for iterating over squads
        this._squadsCache = new Array();

        // for emmiting events to higher instances
        this._eventEmmiter = new EventEmmiter();
    }

    getArmyID(){
        return this._armyID;
    }

    /* add new squad to this army, subscribe for relevant events */
    addSquad(newSquad){
        const newSquadID = newSquad._squadID;
        this._squads.set(newSquadID, newSquad);
        this._squadsCache.push(newSquad);
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

    /* gets the random squad */
    getRandomSquad(){
        let randomIndex = Math.floor(Math.random() * this._squadsCache.length);
        return this._squadsCache[randomIndex];
    }
    
    /* gets the strongest squad in the army, based on the method in Squad class */
    getStrongestSquad(attackedArmyID) {

        let strongestEnemySquad = null;

        for (let currentSquad of this._squadsCache){

            if (currentSquad._armyID != attackedArmyID && !strongestEnemySquad){
                strongestEnemySquad = currentSquad;
                continue;
            }

            if (!strongestEnemySquad)
                continue;
            
            strongestEnemySquad = currentSquad.computeSquadStrength() > strongestEnemySquad.computeSquadStrength() ?
                currentSquad : strongestEnemySquad;
        }

        return strongestEnemySquad;
    }

     /* gets the weakest squad in the army, based on the method in Squad class */
    getWeakestSquad(attackedArmyID){

        let weakestEnemySquad = null;

        for (let currentSquad of this._squadsCache){

            if (currentSquad._armyID != attackedArmyID && !weakestEnemySquad){
                weakestEnemySquad = currentSquad;
                continue;
            }

            if (!weakestEnemySquad)
                continue;
            
            weakestEnemySquad = currentSquad.computeSquadStrength() < weakestEnemySquad.computeSquadStrength() ?
                currentSquad : weakestEnemySquad;
        }

        return weakestEnemySquad;
    }

    /* Do something for each squad */
    forEachSquad(callback){
        this._squads.forEach(callback);
    }

    getArmyID() {
        return this._armyID;
    }

     /* Listen to events - used by upper management classes to listen for the unit events */
    subscribeToEvent(eventName, listener){
        this._eventEmmiter.on(eventName, listener);
    }
}

module.exports = Army;
