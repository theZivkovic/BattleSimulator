# BattleSimulator

## Description
This is a Node textual simulation of battle. It has armies, containing squads, containing soldiers and vehicles, which in the end can be equipped with some soldiers. Each unit has its stats and each army has a defined strategy for acting on the battlefield. When the battle is started, the armies confront each other and when just one army is left standing, the battle is concluded.


## Getting started

### Prerequisites
You should have latest npm and Node installed on you machine.

### Install
> npm install

### Test
> npm run test

### Run 
Choose one test case in index.js by uncommenting the appropriate line and commenting out the other lines. One test case is kinda special - make-a-custom-case. It runs a series of questions/answers to help you define the simulation better. The other test cases are created by myself.

You can also choose where to transfer the logs (to console, to some file, or to hell!), by modifying this line in index.js

> Logger.initialize(LoggerOutput.TO_CONSOLE);

After you finish the customization, you can run:
> npm run start
