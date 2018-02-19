// @flow
import moment from 'moment'

type LogLevel = 'debug'

function log(level: LogLevel, ...args) {
  // eslint-disable-next-line no-console
  console.log(moment().format('YYYY-MM-DD hh:mm:ss a'), `${level.toUpperCase()}:`, ...args)
}

function debug(...args: any) {
  log('debug', ...args)
}

export default {
  debug,
}
