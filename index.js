'use strict';
const axios = require('axios');
const generate = require('csv-generate');
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

const getWheather = async (params = {}) => {
  let response = {};
  try {
    response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params,
    });
  } catch (error) {
    console.log(error);
  }

  return response.data;
}

inquirer.prompt(questions)
  .then(async answers => {
      const {city, degrees} = answers || {};
      const units = (degrees === 'Farenheit') ? 'imperial' : 'metric';
      const params = {
        q: city,
        APPID: wheatherKey,
        units,
      }

      const response = await getWheather(params);

      console.log(response);
  });
