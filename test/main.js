import sharkey from '../src/main'
const logger = console.log.bind(console, '[LOGGER]')



export default (tape) => {

  tape('when passing in connection parameters', (t) => {
    t.plan(1)

    t.deepLooseEqual(
      sharkey({
        state: {},
        message: ['connect', { host: '123.231.121.111', port: 1234}]
      }),
      {
        state: { connecting: true },
        messages: [
          [ 'net-connect', { host: '123.231.121.111', port: 1234 } ],
          [ 'net-set-encoding', 'utf8' ],
        ]
      }
    )

  })

  tape('when passing in connected', (t) => {
    t.plan(1)

    t.deepEqual(sharkey({
      message: ['connected'],
      state: {
        connecting: true
      }
    }),
    { state: { connected: true } })

  })

  tape('when passing in connected', (t) => {
    t.plan(1)

    t.deepLooseEqual(sharkey({
      state: { connecting: true },
      message: ['connected']
    }),{
      state: {
        connected: true
      }
    })

  })

  tape('when issuing play', (t) => {
    t.plan(1)

    t.deepLooseEqual(sharkey({
      state: { connected: true },
      message: [ 'play' ]
    }), {
      messages: [
        [ 'net-write', 'consume\n' ]
      ],
      state: {
        connected: true,
        playRequested: true
      }
    })

  })

  tape('on socket data', (t) => {
    t.plan(1)

    t.deepLooseEqual(sharkey({
      state: { connected: true },
      message: [ 'net-data', 'msg ' + JSON.stringify({ hello:123 })]
    }),{
      messages: [[ 'log', { hello: 123} ]]
    })
  })


}
