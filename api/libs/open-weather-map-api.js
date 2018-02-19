// @flow
import { URL } from 'url'
import request from 'request-promise'

type OWMConfig = {
  version: string,
}

const defaultOWMConfig = { version: '2.5' }

function getOWMUrl(config: OWMConfig = defaultOWMConfig) {
  return `https://api.openweathermap.org/data/${config.version}/`
}

type APISettings = {
  apiKey: string,
}

export default class OpenWeatherMapAPI {
  apiKey: string

  constructor({ apiKey }: APISettings) {
    this.apiKey = apiKey
  }

  async makeRequest(relativeUrl: string, requestConfig: Object, apiConfig?: OWMConfig) {
    const resourceURL = new URL(`${getOWMUrl(apiConfig)}${relativeUrl}`)

    resourceURL.searchParams.append('appid', this.apiKey)
    resourceURL.searchParams.append('mode', 'json')

    const response = await request({
      ...requestConfig,
      json: true,
      url: resourceURL.toString()
    })

    return response
  }

  async get(relativeUrl: string, apiConfig?: OWMConfig) {
    return this.makeRequest(relativeUrl, { method: 'GET' }, apiConfig)
  }

  async post(relativeUrl: string, data: Object, apiConfig?: OWMConfig) {
    return this.makeRequest(relativeUrl, { method: 'POST', json: data }, apiConfig)
  }

  async getForecastByZipCode(zipCode: string, countryCode?: string = 'us') {
    return this.get(`forecast?zip=${encodeURIComponent(zipCode)},${encodeURI(countryCode)}`)
  }

  async getCurrentWeatherByZipCode(zipCode: string, countryCode?: string = 'us') {
    return this.get(`weather?zip=${encodeURIComponent(zipCode)},${encodeURI(countryCode)}`)
  }
}
