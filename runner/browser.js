import tape from 'tape'
import report from 'browserify-tape-spec'
tape.createStream().pipe(report('out'))
import run from '../test/run'
run(tape)
