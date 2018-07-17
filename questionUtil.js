const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askAQuestion = (questionText) => {
    return new Promise((resolve, reject) => {
        rl.question(questionText, (answer) => {
            resolve(answer);
        });
    });
}



const askAQuestionUntilRight = async (questionText, successChecker, errorMessage) => {
    let answer = await askAQuestion(questionText);
    if (!successChecker(answer)){
        console.log(errorMessage);
        return await askAQuestionUntilRight(questionText, successChecker, errorMessage);
    }
    else return answer;
}

module.exports.askAQuestion = askAQuestion;
module.exports.askAQuestionUntilRight = askAQuestionUntilRight;