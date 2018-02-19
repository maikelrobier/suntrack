// @flow
import {
  type Request,
  type Response,
} from 'express'
import ForecastService from '../services/weather-service'

export default {
  get: async function (req: Request, res: Response) {
    const current = await ForecastService.getCurrent('77049')

    res.json({ current })
  }
}
