// @flow
import _ from 'lodash'
import {
  type Forecast,
} from '../../libs/open-weather-map-forecast'
import {
  basicReporter,
} from './common'

type WeatherReporter = (last: ?Forecast, current: Forecast) => string | null

function getSegments(forecast: Forecast) {
  return _(forecast.days)
    .map('segments')
    .flatten()
    .value()
}

const forecastUpdateReporter: WeatherReporter = function (last, current) {
  if (!last) {
    return null
  }

  const beforeSegments = getSegments(last)
  const afterSegments = getSegments(current)

  return basicReporter(beforeSegments, afterSegments)
}

export default forecastUpdateReporter
