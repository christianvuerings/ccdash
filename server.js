var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var extend = require('xtend');

var sharedEvents = require('./server/sharedEventEmitter.js');

/**
 * Set public folder
 */
app.use(express.static('public'));

/**
 * Start the server
 */
var port = process.env.PORT || 3000;
server.listen(port);

/**
 * Load the different builds
 */
var builds = ['bamboo', 'travis', 'github', 'codeclimate'];
var loadBuilds = function() {
  builds.forEach(function(service) {
    var serviceModule = require('./server/' + service + '.js');
    serviceModule.init();
  });
};
loadBuilds();


/**
 * Set up the socket connection
 */
var response = {
  builds: {},
  github: {},
  codeclimate: {}
};

io.sockets.on('connection', function (socket) {

  var listenScrape = function(item) {
    sharedEvents.on('scraped.' + item, function(result) {
      response[item] = extend(response[item], result);
    });
  };
  for (var i in response) {
    if (response.hasOwnProperty(i)) {
      listenScrape(i);
    }
  }

  var emitSocket = function() {
    socket.emit('ccdash', response);
  };

  // Emit socket at 0 & every 3 seconds
  emitSocket();
  setInterval(emitSocket, 3000);

});
