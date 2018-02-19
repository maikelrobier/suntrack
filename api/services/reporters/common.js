// @flow
import moment from 'moment'
import {
  type ForecastSegment,
} from '../../libs/open-weather-map-forecast'

const TEMPERATURE_CHANGE_TRESHOLD_F = 10
const RAIN_CHANCE_CHANGE_TRESHOLD = 0.1

export function basicReporter(beforeSegments: ForecastSegment[], afterSegments: ForecastSegment[]) {
  const city = 'your area'

  for (let i = 0; i < beforeSegments.length; i++) {
    const before = beforeSegments[i]
    const after = afterSegments[i]

    const tempMaxDiff = after.basic.temperatureMax - before.basic.temperatureMax

    if (tempMaxDiff >= TEMPERATURE_CHANGE_TRESHOLD_F) {
      // eslint-disable-next-line max-len
      return `Temperature will increase to ${Math.round(after.basic.temperatureMax)} °F this ${moment(after.time).format('dddd')} in ${city}. 🌡`
    }

    const tempMinDiff = before.basic.temperatureMin - after.basic.temperatureMin

    if (tempMinDiff >= TEMPERATURE_CHANGE_TRESHOLD_F) {
      // eslint-disable-next-line max-len
      return `Temperature will decrease to ${Math.round(after.basic.temperatureMin)} °F this ${moment(after.time).format('dddd')} in ${city}. 🌡`
    }

    const rainChanceDiff = after.rain.chance = before.rain.chance

    if (Math.abs(rainChanceDiff) >= RAIN_CHANCE_CHANGE_TRESHOLD) {
      const verb = rainChanceDiff > 0 ? 'increase' : 'decrease'

      // eslint-disable-next-line max-len
      return `Chance of rain will ${verb} to ${Math.trunc(after.rain.chance * 100)}% this ${moment(after.time).format('dddd')} in ${city}. 🌧`
    }
  }

  return null
}
