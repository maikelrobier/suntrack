// @flow
import { URL } from 'url'
import request from 'request-promise'

const OWM_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/'

type Attributes = {
  apiKey: string,
}

export default class OpenWeatherMapAPI {
  apiKey: string

  constructor({ apiKey }: Attributes) {
    this.apiKey = apiKey
  }

  async fetch(relativeUrl: string) {
    const resourceURL = new URL(`${OWM_API_BASE_URL}${relativeUrl}`)

    resourceURL.searchParams.append('appid', this.apiKey)
    resourceURL.searchParams.append('mode', 'json')

    const response = await request({
      method: 'GET',
      url: resourceURL.toString()
    })

    return response
  }

  async getForecastByZipCode(zipCode: string, countryCode?: string = 'us') {
    return this.fetch(`forecast?zip=${encodeURIComponent(zipCode)},${encodeURI(countryCode)}`)
  }
}
