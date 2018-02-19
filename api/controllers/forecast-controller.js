// @flow
import {
  type Request,
  type Response,
} from 'express'
import ForecastService from '../services/forecast-service'

export default {
  get: async function (req: Request, res: Response) {
    const forecast = await ForecastService.getForecast('77049')

    res.json({ forecast })
  }
}
