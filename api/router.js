// @flow
import express from 'express'

import ForecastController from './controllers/forecast-controller'

const router = express.Router()

router.get('/forecast', ForecastController.get)
