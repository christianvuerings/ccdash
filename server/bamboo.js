var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var scrapeResponse = {};

parseElement = function(element) {
  var response = {
    enabled: element.plan.enabled,
    key: element.key,
    number: element.number,
    state: element.state,
    lifeCycleState: element.lifeCycleState
  };
  return response;
};

var parseBody = function(body) {
  var response = {};
  body = JSON.parse(body);
  if (body && body.results && body.results.result) {
    var result = body.results.result;
    result.forEach(function(element) {
      var key = element.plan.key;
      if (key === 'MYB-CLCMVPMASTER' || key === 'MYB-CLCMVPQA') {
        var realkey = key.replace('MYB-CLCMVP', '');
        response[realkey] = parseElement(element);
      }
    });
  }
  return response;
};

var scrape = function() {
  request({
    url: 'https://bamboo.ets.berkeley.edu/bamboo/rest/api/latest/result.json',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      scrapeResponse = parseBody(body);
      sharedEvents.emit('scraped', {
        bamboo: scrapeResponse
      });
    }
  });
};

var init = function() {
  setInterval(scrape, 4000);
};

module.exports = {
  init: init
};
