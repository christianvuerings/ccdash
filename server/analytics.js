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
    url: 'https://ccdashanalytics2.appspot.com/query?id=ahJzfmNjZGFzaGFuYWx5dGljczJyFQsSCEFwaVF1ZXJ5GICAgICAgIAKDA&format=json',
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
  setInterval(scrapeAnalytics, 30000);
};

module.exports = {
  init: init
};
