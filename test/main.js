import main from '../src/main'
import sinon from 'sinon'

const logger = console.log.bind(console, '[LOGGER]')

export default (tape) => {

  tape('when passing in connection parameters', (t) => {
    t.plan(1)
    const facade = sinon.stub()

    main(facade, { host: '123.231.121.111', port: 1234})
    t.ok(facade.calledWith('connect', {host: "123.231.121.111", port: 1234}),
      'sends connect command')
  })

}
