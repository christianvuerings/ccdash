var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var extend = require('xtend');

var sharedEvents = require('./server/sharedEventEmitter.js');

/**
 * Load all the different services
 */
var services = ['bamboo', 'github'];
var loadServices = function() {
  services.forEach(function(service) {
    var serviceModule = require('./server/' + service + '.js');
    serviceModule.init();
  });
};
loadServices();

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
