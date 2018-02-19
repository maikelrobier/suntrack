// @flow
import os from 'os'
import path from 'path'
import express from 'express'
import _ from 'lodash'
import bodyParser from 'body-parser'
import config from './config'
import router from './router'

/* settings */
const networkIP = _.chain(os.networkInterfaces())
  .values()
  .flatten()
  .find({ family: 'IPv4', internal: false })
  .get('address')
  .value() || '127.0.0.1'
const port = config.api.port
const publicDir = path.join(__dirname, 'public')

/* server instance */
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(publicDir))

app.use('/api', router)

app.get('/', function(request, response) {
  response.send('Suntrack API is running :)')
})

app.listen(port)

/* eslint-disable no-console */
console.log(`
  App running:
  - Local address: http://localhost:${port}
  - Network address: http://${networkIP}:${port}
`)
/* eslint-enable no-console */
