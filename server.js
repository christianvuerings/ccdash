var express = require('express');
var app = express();

var http = require('http');
var sockjs = require('sockjs');
var echo = sockjs.createServer();
var server = http.createServer(app);
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

echo.installHandlers(server, {
  prefix:'/echo'
});
server.listen(9997, '0.0.0.0');
console.log('[%s] Server running', process.pid);

/**
 * Load the different builds
 */
var builds = ['bamboo', 'travis', 'github', 'codeclimate', 'stats'];
var loadBuilds = function() {
  builds.forEach(function(service) {
    require('./server/' + service + '.js').init();
  });
};
loadBuilds();


/**
 * Set up the socket connection
 */
var response = {
  builds: {},
  github: {},
  codeclimate: {},
  stats: {}
};
var previousResponse = {};

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

echo.on('connection', function(conn) {

  var emitSocket = function() {
    //if (JSON.stringify(previousResponse) !== JSON.stringify(response)) {
    previousResponse = response;
    conn.write(JSON.stringify(response));
    //}
  };

  // Emit socket at 0 & every 3 seconds
  emitSocket();
  setInterval(emitSocket, 3000);

});
