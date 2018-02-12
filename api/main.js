import os from 'os'
import path from 'path'
import express from 'express'
import _ from 'lodash'

/* Playground */
import OpenWeatherMapAPI from './libs/open-weather-map-api'
import { parseForecast } from './libs/open-weather-map-forecast'
import WeatherOberver from './services/weather-observer'

const observer = new WeatherOberver()

observer.observe()
// import Mailer from './libs/mailer'

const weather = new OpenWeatherMapAPI({
  apiKey: process.env.OWM_API_KEY,
})

weather.getForecastByZipCode('77049').then(response => {
  parseForecast(response)
})
// weather.createTrigger()
// weather.getTriggers()

// const mailOptions = {
//   to: 'mail@gmail.com',
//   subject: 'Weather Updates',
//   text: 'Rain is in the forecast for Friday. Stay dry!'
// }

// const mailer = new Mailer({
//   user: process.env.EMAIL_USER,
//   password: process.env.EMAIL_PASSWORD,
// })

// mailer.sendMail(mailOptions)
/* End: Playground */

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
