import shellBase from '../framework/shell-base'
import core from './core'
import net from 'net-browserify'
import uuid from 'uuid'

net.setProxy({
    hostname: 'localhost',
    port: 4443
});

const log = (host, port) => {

  let connection = null
  let send = shellBase(core, {
    'net-connect': (body) => {
      connection = net.connect({port, host})
      connection.on('data', (x) => send('net-data', x))
      connection.on('error', (x) => {
        console.warn('socket error', x)
       })
    },
    'net-set-encoding': (body) => connection.setEncoding(body),
    'net-write': (body) => connection.write(body),
    'generate-guid': () => send('guid-generated', uuid()),

  })

  return {
    player: (topic) => {
      send('set-topic', topic)
      send('connect', { host, port })
    }
  }

}

export default log
