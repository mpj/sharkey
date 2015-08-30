export default (input) => {
  let [type, opts] = input.message

  switch(type) {
    case 'connect':
      return {
        messages: [
          [ 'net-connect', { host: opts.host, port: opts.port } ],
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
  }

}
