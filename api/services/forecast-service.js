// @flow
import _ from 'lodash'
import config from '../config'
import OpenWeatherMapAPI from '../libs/open-weather-map-api'
import {
  parseForecast,
  type Forecast,
} from '../libs/open-weather-map-forecast'

const weatherAPI = new OpenWeatherMapAPI({ apiKey: config.owm.apiKey })

const ONE_HOUR = 1000 * 60 * 60

async function getForecast(zipCode: string): Promise<Forecast> {
  const response = await weatherAPI.getForecastByZipCode(zipCode)

  return parseForecast(response)
}

export default {
  getForecast: _.throttle(getForecast, ONE_HOUR),
}
