const questionUtil = require('./questionUtil');
const Soldier = require('./soldier');
const Vehicle = require('./vehicle');
const BattleSimulator = require('./battle-simulator');

let s = new Soldier(100, 50, 1);
let v = new Vehicle(100, 2000);

let bs = new BattleSimulator();
bs.addArmy("BLUE");
bs.addArmy("RED");
bs.addArmy("GREEN");
bs.setAllies("BLUE", "RED");



// const askHowAreYou = async () => {
//     const answer = await questionHelper('how are you?');
//     console.log('The answer was ', answer);
//     const answer2 = await questionHelper('how are you2?');
//     console.log('The answer was ', answer2);
//     const answer3 = await questionHelper('how are you3?');
//     console.log('The answer was ', answer3);
//     rl.close();
// }

// askHowAreYou();
