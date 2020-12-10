'use strict';
const inquirer = require('inquirer');

const questions = [
  {
    type: 'input',
    name: 'City',
    message: 'Input the City that you want to know the wheather',
    default: 'Dallas, Tx'
  },
  {
    type: 'list',
    name: 'degrees',
    message: 'How would you like to see the temperature?',
    choices: [
      'Farenheit',
      'Celcius',
    ],
  }
];

inquirer.prompt(questions).then(answers => {
  console.log(JSON.stringify(answers, null, '  '));
});