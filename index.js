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
};

const writeCSVFile = (fileName = '', fileContent = '') => {
  let count = 1;

  let newFile = false;

  if (!fs.existsSync(`${fileName}.csv`)) {
    fs.writeFileSync(`${fileName}.csv`, fileContent);
  } else {
    while (!newFile) {
      if (fs.existsSync(`${fileName}(${count}).csv`)) count += 1;
      else {
        fs.writeFileSync(`${fileName}(${count}).csv`, fileContent);
        
        newFile = true;
      }
    }
  }

  return `The Csv file has been saved into the root of this project.`;
};

inquirer.prompt(questions)
  .then(async answers => {
    const { city, degrees } = answers || {};
    if (!city) throw new Error('The city field is required');
    if (!degrees) throw new Error('A unit needs to be selected');

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

    let fileName = `${city}-wheater-today`;
    const fileContent = `${headers}\n${values}`;

    const message = writeCSVFile(fileName, fileContent);

    console.log(message);
  });
