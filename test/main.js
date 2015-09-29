import sharkey from '../src/core'
const logger = console.log.bind(console, '[LOGGER]')



export default (tape) => {

  const reducerTest = (title, [input, result]) =>
    tape(title, (t) => {
      t.plan(1)
      deepLooseEqual(sharkey(input), result)
    })

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

  reducerTest('ready (no guid)', {
    "state": {
      "topic": "mytopic",
      "connecting": true
    },
    "message": [
      "net-data",
      "ready\n"
    ]
  },{
    "state": {
      "topic": "mytopic",
      "connecting": true
    },
    "messages": [
      [
        "generate-guid"
      ],
      [
        "net-data",
        "ready\n"
      ]
    ]
  })

  reducerTest('on guid-generated', {
    "state": {
      "topic": "mytopic",
      "connecting": true
    },
    "message": [
      "guid-generated",
      "99c885d2-9ef9-4fdb-ba2c-00eaab94a820"
    ]
  },{
    "state": {
      "lastGeneratedGUID": "99c885d2-9ef9-4fdb-ba2c-00eaab94a820"
    }
  })

  reducerTest('ready (with guid generated)', {
    "message": [
      "net-data",
      "ready\n"
    ]
    "state": {
      "topic": "mytopic",
      "connecting": true,
      "lastGeneratedGUID": "7091319e-101d-4fa4-b392-6b5cf6901755"
    },
  },{
    "state": {
      "connected": true,
      "playRequested": true
    },
    "messages": [
      [
        "net-write",
        "consume mytopic 7091319e-101d-4fa4-b392-6b5cf6901755 smallest\n"
      ]
    ]
  })


}
