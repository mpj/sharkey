import _ from 'lodash'

export default (input) => {
  let state = input.state
  let [type, body] = input.message

  switch(type) {

    case 'guid-generated':
      return {
        state: {
          lastGeneratedGUID: body
        }
      }
      break;

    case 'set-topic':
      //start here
      return {
        state: {
          topic: body
        }
      }
      break;

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



    case 'net-data':
      if(body.match(/^ready/)) {
        if (!state.lastGeneratedGUID) {
          return {
            state,
            messages: [
              [ 'generate-guid' ],
              input.message
            ]
          }
        }
        return {
          messages: [
            [
              'net-write',
              'consume ' +
              state.topic + ' ' +
              state.lastGeneratedGUID + ' ' +
              'smallest' +
              '\n']
          ],
          state: {
            connected: true,
            playRequested: true
          }
        }
      } else {
        return {
          messages: [
            [ 'log', JSON.parse(body.replace('msg ', ''))  ]
          ]
        }
      }
  }

}
