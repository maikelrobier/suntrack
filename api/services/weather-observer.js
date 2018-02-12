// @flow
import _ from 'lodash'
import moment from 'moment'
import Mailer from '../libs/mailer'
import OpenWeatherMapAPI from '../libs/open-weather-map-api'
import {
  parseForecast,
  type Forecast,
} from '../libs/open-weather-map-forecast'

const hardCodedZip = '77049'
const hardCodedCity = 'Houston'

const weather = new OpenWeatherMapAPI({
  apiKey: process.env.OWM_API_KEY,
})

const mailer = new Mailer({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
})

const POLL_INTERVAL = 1000 * 60 * 60 * 8 // 8hrs

let lastForecast = null
// let lastForecast = {
//   days: [{
//     segments: [{
//       basic: {
//         temperatureMax: 30,
//         temperatureMin: 70,
//       },
//     }],
//     time: Date.now(),
//   }]
// }

function getSegments(forecast: Forecast) {
  return _(forecast.days)
    .map('segments')
    .flatten()
    .value()
}

function getForecastAlert(before: Forecast, after: Forecast): string | null {
  const beforeSegments = getSegments(before)
  const afterSegments = getSegments(after)
  const city = hardCodedCity

  // checking temperature only for the moment
  const TEMPERATURE_CHANGE_TRESHOLD_F = 10

  for (let i = 0; i < beforeSegments.length; i++) {
    const before = beforeSegments[i]
    const after = afterSegments[i]

    const tempMaxDiff = after.basic.temperatureMax - before.basic.temperatureMax

    if (tempMaxDiff > TEMPERATURE_CHANGE_TRESHOLD_F) {
      return `Temperature will increase to ${Math.round(after.basic.temperatureMax)} °F this ${moment(after.time).format('dddd')} in ${city}.`
    }

    const tempMinDiff = before.basic.temperatureMin - after.basic.temperatureMin

    if (tempMinDiff > TEMPERATURE_CHANGE_TRESHOLD_F) {
      return `Temperature will decrease to ${Math.round(after.basic.temperatureMin)} °F this ${moment(after.time).format('dddd')} in ${city}.`
    }
  }

  return null
}

function notifyByEmail(text: string) {
  const mailOptions = {
    to: 'maikelrobier@gmail.com, beatrizcalzadilla@gmail.com',
    subject: 'Weather Updates',
    html: `
      <div>
        <p>${text}</p>
      </div>
    `,
  }

  mailer.sendMail(mailOptions)
}

function check() {
  weather.getForecastByZipCode(hardCodedZip).then(response => {
    const forecast: Forecast = parseForecast(response)

    if (lastForecast) {
      const alert: string | null = getForecastAlert(lastForecast, forecast)

      if (alert) {
        notifyByEmail(alert)
      }
    }

    lastForecast = forecast
  })
}

export default class WeatherObserver {
  observe() {
    setInterval(check, POLL_INTERVAL)
  }
}
