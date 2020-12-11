'use strict';
const axios = require('axios');
const inquirer = require('inquirer');
const { wheatherKey } = require('./Key.json');

const questions = [
  {
    type: 'input',
    name: 'city',
    message: 'Input the City that you want to know the wheather',
    default: 'Dallas,US'
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

inquirer.prompt(questions)
  .then(answers => {
      const {city, degrees} = answers || {};
      const units = (degrees === 'Farenheit') ? 'imperial' : 'metric';

      axios.get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          APPID: wheatherKey,
          units
        }
      })
      .then(response => {
        console.log(JSON.stringify(response, null, '  '));
        console.log('respouesta');
        // todo Export the response into a csv
      }).catch(error => {
        console.log(JSON.stringify(error, null, '  '));
        console.log('error');
      });
  });
