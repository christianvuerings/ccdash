var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var username = process.env.BAMBOO_USERNAME;
var password = process.env.BAMBOO_PASSWORD;

var sendEvent = function(scrapeResponse) {
  process.nextTick(function() {
    sharedEvents.emit('scraped.builds', {
      bamboo: scrapeResponse
    });
  });
};

var parseElement = function(scrapeResponse, key, element) {
  scrapeResponse[key].key = element.key;
  scrapeResponse[key].number = element.number;
  scrapeResponse[key].state = element.state.toLowerCase(); //successful / failed
  scrapeResponse[key].planUrl = 'https://bamboo.ets.berkeley.edu/bamboo/browse/' + element.plan.key;
  scrapeResponse[key].currentBuildUrl = 'https://bamboo.ets.berkeley.edu/bamboo/browse/' + element.key;
};

var parsePlan = function(scrapeResponse, key, body) {
  body = JSON.parse(body);
  scrapeResponse[key].isBuilding = body.isBuilding;
};

var scrapePlan = function(scrapeResponse, key, url) {
  request({
    url: url,
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      parsePlan(scrapeResponse, key, body);
      sendEvent(scrapeResponse);
    }
  }).auth(username, password, true);
};

var parsePlans = function(body) {
  body = JSON.parse(body);
  var scrapeResponse = {};
  if (body && body.results && body.results.result) {
    var result = body.results.result;
    result.forEach(function(element) {
      var key = element.plan.key;
      if (key === 'MYB-CLCMVPMASTER' || key === 'MYB-CLCMVPQA') {
        var realkey = key.replace('MYB-CLCMVP', '').toLowerCase();
        if (!scrapeResponse[realkey]) {
          scrapeResponse[realkey] = {};
        }
        scrapePlan(scrapeResponse, realkey, element.plan.link.href + '.json');
        parseElement(scrapeResponse, realkey, element);
      }
    });
  }
};

var timeout;
var scrapePlans = function() {
  request({
    url: 'https://bamboo.ets.berkeley.edu/bamboo/rest/api/latest/result.json',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        parsePlans(body);
      });
    }
  }).auth(username, password, true);
  timeout = setTimeout(scrapePlans, 4000);
};

var init = function() {
  scrapePlans();
};

module.exports = {
  init: init
};
