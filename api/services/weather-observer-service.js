// @flow
import _ from 'lodash'
import Mailer from '../libs/mailer'
import logger from '../libs/logger'
import { type Forecast } from '../libs/open-weather-map-forecast'
import config from '../config'
import WeatherService from './weather-service'

import nextDayReporter from './reporters/next-day-reporter'
import forecastUpdateReporter from './reporters/forecast-update-reporter'

const POLL_INTERVAL = 1000 * 60 / 6
// const POLL_INTERVAL = 1000 * 60 * 60 * 8 // 8hrs

export default class WeatherObserver {
  lastForecast: Forecast | null
  zipCode: string
  mailer: any

  constructor(zipCode: string) {
    this.lastForecast = null
    this.mailer = new Mailer(config.email.settings, config.email.sender)
    this.zipCode = zipCode
  }

  _notifyByEmail = (text: string) => {
    logger.debug('_notifyByEmail()')

    const mailOptions = {
      to: 'maikelrobier@gmail.com',
      subject: 'Weather Updates',
      html: `
        <div>
          <p>${text}</p>
        </div>
      `,
    }

    this.mailer.sendMail(mailOptions)
  }

  _check = async () => {
    const forecast = await WeatherService.getForecast(this.zipCode)

    logger.debug('_check()')

    const reports = _.compact(
      nextDayReporter(this.lastForecast, forecast),
      forecastUpdateReporter(this.lastForecast, forecast),
    )

    logger.debug('reports:', reports.length)

    if (reports.length) {
      this._notifyByEmail(reports.join('\n'))
    }

    this.lastForecast = forecast
  }

  observe() {
    setInterval(this._check, POLL_INTERVAL)
  }
}
