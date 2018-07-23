const fs = require('fs');
const path = require('path');

const LoggerOutput = Object.freeze({
    TO_CONSOLE: 'TO_CONSOLE',
    TO_FILE: 'TO_FILE',
    NO_OUTPUT: 'NO_OUTPUT'
});

const LOGS_DIR = 'output';
const LOGS_PATH = path.join(LOGS_DIR, 'log.txt');

class Logger {

    /* Specifies where to log the files and defines the starting moment of logging */
    static initialize(output){

        Logger.startingTime = new Date().getTime();

        Logger.output = output;
        switch(Logger.output){
            case LoggerOutput.TO_CONSOLE: break;
            case LoggerOutput.TO_FILE:
                
                if (!fs.existsSync(LOGS_DIR))
                    fs.mkdirSync(LOGS_DIR);

                fs.writeFile(LOGS_PATH, '', err => {if (err) console.error(err)});
                console.log(`Note: Logs are being saved into the file ${LOGS_PATH}.\nPlease wait until BATTLE OVER! appears.`);
            case LoggerOutput.NO_OUTPUT: break;
        }
    }

    /* Private logging method that does all the hard work here */
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

    /* Log something specific to unit */
    static logUnit(unit, didWhat){
        Logger._log(`ARMY#${unit._armyID}::SQUAD#${unit._squadID}::${unit.constructor.name}#${unit._unitID}: ${didWhat}`);
    }

    /* Log something specific to squad */
    static logSquad(squad, didWhat){
        Logger._log(`ARMY#${squad._armyID}::SQUAD#${squad._squadID}::${didWhat}`);
    }
    
    /* Log something specific to army */
    static logArmy(army, didWhat){
        Logger._log(`ARMY#${army._armyID}::${didWhat}`);
    }

    /* Log something totally free */
    static logBattle(message){
        Logger._log(message);
    }

    /* Log the health statuses of squads and units in the army */
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