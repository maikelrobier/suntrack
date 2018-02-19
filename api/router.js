// @flow
import express from 'express'

import ForecastController from './controllers/forecast-controller'
import WeatherController from './controllers/weather-controller'

const router = express.Router()

router.get('/forecast', ForecastController.get)
router.get('/current', WeatherController.get)

export default router
