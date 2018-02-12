// @flow
import _ from 'lodash'

// OWM API objects

type OWMForecastMain = {
  grnd_level: number,
  humidity: number,
  pressure: number,
  sea_level: number,
  temp: number,
  temp_kf: number,
  temp_max: number,
  temp_min: number,
}

type OWMForecastRain = {
  '3h'?: number, // chance of precipitation for last 3 hours
}

type OWMForecastItem = {
  dt_txt: string,
  main: OWMForecastMain,
  rain: OWMForecastRain,
}

type OWMForecastResponse = {
  list: OWMForecastItem[],
}

// normalized objects

export type ForecastBasicData = {
  temperatureMax: number,
  temperatureMin: number,
}

export type ForecastRainData = {
  chance: number,
}

export type ForecastSegment = {
  basic: ForecastBasicData,
  rain: ForecastRainData,
  time: string,
}

export type ForecastDay = {
  segments: ForecastSegment[],
  time: string,
}

export type Forecast = {
  days: ForecastDay[]
}

function createSegment(item: OWMForecastItem): ForecastSegment {
  const {
    dt_txt,
    main: { temp_max, temp_min },
    rain,
  } = item

  const segment = {
    basic: {
      temperatureMax: kelvinToFahrenheit(temp_max),
      temperatureMin: kelvinToFahrenheit(temp_min),
    },
    rain: {
      chance: rain['3h'] || 0,
    },
    time: dt_txt,
  }

  return segment
}

function createDay(segmentItems: OWMForecastItem[]): ForecastDay {
  const segments = _.map(segmentItems, createSegment)

  return {
    segments,
    time: _.first(segmentItems).dt_txt,
  }
}

export function parseForecast(forecast: OWMForecastResponse): Forecast {
  const dailyChunks = _.chunk(forecast.list, 24 / 3) // 3 hrs segments

  return {
    days: _.map(dailyChunks, createDay),
  }
}

export function kelvinToCelsius(value: number) {
  return value - 273.15
}

export function kelvinToFahrenheit(value: number) {
  return (kelvinToCelsius(value) * 1.8) + 32
}
