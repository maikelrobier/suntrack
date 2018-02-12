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

type Attributes = {
  apiKey: string,
}

export default class OpenWeatherMapAPI {
  apiKey: string

  constructor({ apiKey }: Attributes) {
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

    // console.log(response) // eslint-disable-line no-console

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

  async createTrigger() {
    const data = {
      'time_period': {
        'start': {
          'expression': 'after',
          'amount': 1000 * 60 * 5,
        },
        'end': {
          'expression': 'after',
          'amount': 1000 * 60 * 24,
        }
      },
      'conditions': [
        {
          'name': 'temp',
          'expression': '$lt',
          'amount': 277,
        }
      ],
      'area': [
        {
          'type': 'Point',
          'coordinates': [
            -95.3698028,
            29.7604267
          ]
        }
      ]
    }

    return this.post('triggers', data, { version: '3.0' })
  }

  async getTriggers() {
    return this.get('triggers', { version: '3.0' })
  }
}
