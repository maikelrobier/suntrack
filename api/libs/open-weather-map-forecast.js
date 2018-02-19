// @flow
import _ from 'lodash'

/* OWM API objects */

// Forecast

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
  '3h'?: number,
}

type OWMForecastItem = {
  dt_txt: string,
  main: OWMForecastMain,
  rain: OWMForecastRain,
}

type OWMForecastResponse = {
  city: {
    name: string,
  },
  list: OWMForecastItem[],
}

// Current weather

type OWMCurrentWeatherMain = {
  humidity: number,
  pressure: number,
  temp: number,
  temp_max: number,
  temp_min: number,
}

type OWMCurrentWeatherResponse = {
  main: OWMCurrentWeatherMain,
  name: string,
}
/* End: OWM API objects */

/* Normalized Objects */

// Forecast

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
  city: {
    name: string,
  },
  days: ForecastDay[]
}

// CurrentWeather
export type CurrentWeather = {
  city: {
    name: string,
  },
  main: {
    temperature: number,
    temperatureMax: number,
    temperatureMin: number,
  },
}

/* End: Normalized Objects */

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
    city: {
      name: forecast.city.name,
    },
    days: _.map(dailyChunks, createDay),
  }
}

export function parseCurrent(currentWeather: OWMCurrentWeatherResponse): CurrentWeather {
  console.log(currentWeather)

  return {
    city: {
      name: currentWeather.name,
    },
    main: {
      temperature: currentWeather.main.temp,
      temperatureMax: currentWeather.main.temp_max,
      temperatureMin: currentWeather.main.temp_min,
    },
  }
}

export function kelvinToCelsius(value: number) {
  return value - 273.15
}

export function kelvinToFahrenheit(value: number) {
  return (kelvinToCelsius(value) * 1.8) + 32
}
