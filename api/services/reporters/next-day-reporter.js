// @flow
import _ from 'lodash'
import moment from 'moment'
import { type Forecast } from '../../libs/open-weather-map-forecast'
import { basicReporter } from './common'

type WeatherReporter = (last: ?Forecast, current: Forecast) => string | null

const nextDayReporter: WeatherReporter = function (last, current) {
  /**
   * A Naive approach would be to assume current.days[0] is today, but the source of truth should be the `time` field
   */
  const todayIndex = _.findIndex(current.days, day => {
    const segment = day.segments[0]

    return moment().isSame(new Date(segment.time), 'day')
  })

  if (todayIndex < 0) {
    return null
  }

  const tomorrowIndex = todayIndex + 1

  if (tomorrowIndex >= current.days.length) { // 5/8 forecast starts on the day after the request, what to do ?
    return null
  }

  const todaySegments = current.days[todayIndex].segments
  const tomorrowSegments = current.days[tomorrowIndex].segments

  return basicReporter(todaySegments, tomorrowSegments)
}

export default nextDayReporter

