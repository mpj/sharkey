import main from '../src/main'
export default (tape) => {

  tape('when calling constructor with arguments', (t) => {
    t.plan(2)

    t.ok(main(), 'yes!')
  })

}
