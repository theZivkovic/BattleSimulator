const fs = require('fs');

const LoggerOutput = Object.freeze({
    TO_CONSOLE: 'TO_CONSOLE',
    TO_FILE: 'TO_FILE'
});

const LOGS_PATH = './log.txt';

class Logger {

    static initialize(output){
        Logger.output = output;
        switch(Logger.output){
            case LoggerOutput.TO_CONSOLE: break;
            case LoggerOutput.TO_FILE: 
                fs.writeFile(LOGS_PATH, '', err => {if (err) console.error(err)});
                console.log(`Note: Logs are being saved into the file ${LOGS_PATH}`);
        }
    }

    static _log(message) {

        if (!Logger.output)
            throw ('Logger:_log: initialize method should be called on Logger class before any of the logs are written!');

        switch(Logger.output){
            case LoggerOutput.TO_CONSOLE:
                console.log(message);
                break;
            case LoggerOutput.TO_FILE: 
                fs.appendFile(LOGS_PATH, `${message}\n`, err => {if (err) console.error(err)});
                break;
        }
    }

    static logUnit(unit, didWhat){
        Logger._log(`ARMY#${unit._armyID}::SQUAD#${unit._squadID}::${unit.constructor.name}#${unit._unitID}: ${didWhat}`);
    }

    static logSquad(squad, didWhat){
        Logger._log(`ARMY#${squad._armyID}::SQUAD#${squad._squadID}: ${didWhat}`);
    }

    static logArmy(army, didWhat){
        Logger._log(`ARMY#${army._armyID}: ${didWhat}`);
    }

    static logBattle(message){
        Logger._log(message);
    }

}

module.exports.Logger = Logger;
module.exports.LoggerOutput = LoggerOutput;