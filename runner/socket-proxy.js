var express = require('express')
var netApi = require('net-browserify')
var cors = require('cors')

module.exports = function() {
  var app = express();

  app.use(cors({
    origin: 'http://localhost:8000',
    credentials: true
  }))

  app.use(netApi());

  var server = app.listen(4443, function() {
    console.log('Socket proxy started on port ' + server.address().port);
  })
}
