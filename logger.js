class Logger {

    static logUnit(unit, didWhat){
        console.log(`ARMY#${unit._armyID}::SQUAD#${unit._squadID}::${unit.constructor.name}#${unit._unitID}: ${didWhat}`);
    }

    static logSquad(squad, didWhat){
        console.log(`ARMY#${squad._armyID}::SQUAD#${squad._squadID}: ${didWhat}`);
    }

    static logArmy(army, didWhat){
        console.log(`ARMY#${army._armyID}: ${didWhat}`);
    }

    static logBattle(message){
        console.log(message);
    }

}

module.exports = Logger;