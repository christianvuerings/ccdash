var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var sendEvent = function(scrapeResponse) {
  sharedEvents.emit('scraped.analytics', scrapeResponse);
};

var parseAnalytics = function(body) {
  body = JSON.parse(body);

  var response = {
    activeUsers: parseInt(body.totalsForAllResults['rt:activeUsers'], 10),
    url: 'https://calcentral.berkeley.edu/'
  };

  sendEvent(response);
};

var scrapeAnalytics = function() {
  request({
    url: 'https://ccdashanalytics.appspot.com/query?id=ahFzfmNjZGFzaGFuYWx5dGljc3IVCxIIQXBpUXVlcnkYgICAgICAgAoM&format=json',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        parseAnalytics(body);
      });
    }
  });
};

var init = function() {
  setInterval(scrapeAnalytics, 5000);
};

module.exports = {
  init: init
};
