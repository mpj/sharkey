import _ from 'lodash'

let shell = (core, handlers) => {

  let state = {}

  const send = (type, body) => {

    const input = {
      state,
      message: [ type, body ]
    }

    let result, isError = false
    try {
      result = core(input)
    } catch (e) {
      console.error('[ERROR]\n'+JSON.stringify(input, null, 2))
      throw e
    }
    if (shell.debug === true || _.matches(shell.debug)(input) || _.matches(shell.debug)(result)) {
      console.log(
        '[REDUCTION]\n'+
        JSON.stringify(input, null, 2) +
        ',' +
        JSON.stringify(result, null, 2))
    }
    if (!result) return false;

    state = _.merge(input.state, result.state)

    ;(result.messages || []).forEach(([type, body]) => {
      if (handlers[type]) {
        handlers[type](body)
      } else {
        const handledByCore = !!send(type, body)
        if (!handledByCore) {
          throw new Error(
            'No handler registered on shell for message type "' + type +
            '", and core did not handle it')
        }
      }

    })
    return true
  }

  return send
}

shell.debug = false

export default shell
