import os from 'os'
import path from 'path'
import express from 'express'
import _ from 'lodash'

import OpenWeatherMapAPI from './libs/open-weather-map-api'

const weather = new OpenWeatherMapAPI({
  apiKey: process.env.OWM_API_KEY,
})

weather.getForecastByZipCode('77049')

const publicDir = path.join(__dirname, 'public')

const networkIP = _.chain(os.networkInterfaces())
  .values()
  .flatten()
  .find({ family: 'IPv4', internal: false })
  .get('address')
  .value() || '127.0.0.1'

const port = process.env.PORT || 6060

const app = express()

app.use(express.static(publicDir))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(port)

/* eslint-disable no-console */
console.log(`
  App running:
  - Local address: http://localhost:${port}
  - Network address: http://${networkIP}:${port}
`)
/* eslint-enable no-console */
