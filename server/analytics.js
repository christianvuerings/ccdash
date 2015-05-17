var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var sendEvent = function(scrapeResponse) {
  sharedEvents.emit('scraped.analytics', scrapeResponse);
};

var parseAnalytics = function(body) {
  body = JSON.parse(body);

  var response = {
    activeUsers: parseInt(body.totalsForAllResults['rt:activeUsers'], 10),
    url: 'https://www.google.com/analytics/web/?hl=en'
  };

  sendEvent(response);
};

var urls = ['https://ccdashanalytics2.appspot.com/query?id=ahJzfmNjZGFzaGFuYWx5dGljczJyFQsSCEFwaVF1ZXJ5GICAgICAgIAKDA&format=json',
'https://ccdashanalytics.appspot.com/query?id=ahFzfmNjZGFzaGFuYWx5dGljc3IVCxIIQXBpUXVlcnkYgICAgICAgAoM&format=json'];
var currentURL = urls[0];

var switchCurrentURL = function() {
  if (currentURL === urls[0]) {
    currentURL = urls[1];
  } else {
    currentURL = urls[0];
  }
};

var scrapeAnalytics = function() {
  request({
    url: currentURL,
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        parseAnalytics(body);
      });
    } else {
      switchCurrentURL();
    }
  });
};

var init = function() {
  setInterval(scrapeAnalytics, 20000);
};

module.exports = {
  init: init
};
