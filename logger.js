const fs = require('fs');

const LoggerOutput = Object.freeze({
    TO_CONSOLE: 'TO_CONSOLE',
    TO_FILE: 'TO_FILE',
    NO_OUTPUT: 'NO_OUTPUT'
});

const LOGS_PATH = './log.txt';

class Logger {

    static initialize(output){

        Logger.startingTime = new Date().getTime();

        Logger.output = output;
        switch(Logger.output){
            case LoggerOutput.TO_CONSOLE: break;
            case LoggerOutput.TO_FILE: 
                fs.writeFile(LOGS_PATH, '', err => {if (err) console.error(err)});
                console.log(`Note: Logs are being saved into the file ${LOGS_PATH}.\nPlease wait until BATTLE OVER! appears.`);
            case LoggerOutput.NO_OUTPUT: break;
        }
    }

    static _log(message, includeTime = true) {

        if (!Logger.output)
            throw ('Logger:_log: initialize method should be called on Logger class before any of the logs are written!');

        let fullMessage = '';

        if (includeTime){
            const elapsedTime = new Date().getTime() - Logger.startingTime;
            fullMessage = `[${elapsedTime} ms] ${message}`;
        }
        else {
            fullMessage = message;
        }

        switch(Logger.output){
            case LoggerOutput.TO_CONSOLE:
                console.log(fullMessage);
                break;
            case LoggerOutput.TO_FILE: 
                fs.appendFile(LOGS_PATH, `${fullMessage}\n`, err => {if (err) console.error(err)});
                break;
            case LoggerOutput.NO_OUTPUT:
                // just do nothing
                break;
        }
    }

    static logUnit(unit, didWhat){
        Logger._log(`ARMY#${unit._armyID}::SQUAD#${unit._squadID}::${unit.constructor.name}#${unit._unitID}: ${didWhat}`);
    }

    static logSquad(squad, didWhat){
        Logger._log(`ARMY#${squad._armyID}::SQUAD#${squad._squadID}::${didWhat}`);
    }

    static logArmy(army, didWhat){
        Logger._log(`ARMY#${army._armyID}::${didWhat}`);
    }

    static logBattle(message){
        Logger._log(message);
    }

    static logArmyStats(army){
        let logString = `======== Army#${army._armyID} stats ========\n`;
        army._squads.forEach((squad) => {
            logString += `Squad#${squad._squadID}\n`;
            squad._units.forEach((unit) => {
                logString += ` ${unit.constructor.name}#${unit._unitID} (${unit._health.toFixed(2)} HP)\n`;
            });
        });
        logString += '\n';
        Logger._log(logString, false);
    }

}

module.exports.Logger = Logger;
module.exports.LoggerOutput = LoggerOutput;