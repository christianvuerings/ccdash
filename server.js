var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var extend = require('xtend');

var sharedEvents = require('./server/sharedEventEmitter.js');

var bamboo = require('./server/bamboo.js');
bamboo.init();

var port = process.env.PORT || 3000;
server.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.use(express.static('public'));


var response = {
  services: {}
};

io.sockets.on('connection', function (socket) {

  sharedEvents.on('scraped', function(result) {
    response.services = extend(response.services, result);
    socket.emit('ccdash', response);
  });

});
