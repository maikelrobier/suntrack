// @flow
import _ from 'lodash'
import config from '../config'
import OpenWeatherMapAPI from '../libs/open-weather-map-api'
import {
  parseForecast,
  parseCurrent,
  type Forecast,
  type CurrentWeather,
} from '../libs/open-weather-map-forecast'

const weatherAPI = new OpenWeatherMapAPI({ apiKey: config.owm.apiKey })

const ONE_HOUR = 1000 * 60 * 60

async function getForecast(zipCode: string): Promise<Forecast> {
  const response = await weatherAPI.getForecastByZipCode(zipCode)

  return parseForecast(response)
}

async function getCurrent(zipCode: string): Promise<CurrentWeather> {
  const response = await weatherAPI.getCurrentWeatherByZipCode(zipCode)

  return parseCurrent(response)
}

export default {
  getForecast: _.throttle(getForecast, ONE_HOUR),
  getCurrent: _.throttle(getCurrent, ONE_HOUR),
}
