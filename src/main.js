export default (input) => {
  let [type, body] = input.message

  switch(type) {

    case 'connect':
      return {
        messages: [
          [ 'net-connect', { host: body.host, port: body.port } ],
          [ 'net-set-encoding', 'utf8' ]
        ],
        state: {
          connecting: true
        }
      }

    case 'connected':
      return {
        state: {
          connected: true
        }
      }

    case 'play':
      return {
        messages: [
          ['net-write', 'consume\n']
        ],
        state: {
          connected: true,
          playRequested: true
        }
      }

    case 'net-data':
      return {
        messages: [
          [ 'log', JSON.parse(body.replace('msg ', ''))  ]
        ]
      }
  }

}
