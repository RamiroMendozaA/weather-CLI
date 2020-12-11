'use strict';
const axios = require('axios');
const fs = require('fs');
const inquirer = require('inquirer');
const { weatherKey } = require('./Key.json');

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

const getWeather = async (params = {}) => {
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
        APPID: weatherKey,
        units,
      }

      const response = await getWeather(params);
      const weatherOutput = {
        temperature: response.main.temp,
        unit: degrees,
        rain: response.weather[0].main === 'Rain',
      }
      const headers = Object.keys(weatherOutput).map(header => header);
      const values = Object.values(weatherOutput).map(values => values);
      
      fs.writeFileSync(`${city}-wheater-today.csv`, `${headers}\n${values}`);

      console.log(`The Csv file has been saved into the root of this project with the folowing name: ${city}-wheater-today.csv`)
  });
