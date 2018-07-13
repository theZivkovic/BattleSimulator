const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questionHelper = (questionText) => {
    return new Promise((resolve, reject) => {
        rl.question(questionText, (answer) => {
            resolve(answer);
        });
    });
}

module.exports = questionHelper;
