var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var scrapeResponse = {};

var username = process.env.BAMBOO_USERNAME;
var password = process.env.BAMBOO_PASSWORD;

var parseElement = function(key, element) {
  scrapeResponse[key].key = element.key;
  scrapeResponse[key].number = element.number;
  scrapeResponse[key].state = element.state.toLowerCase(); //successful / failed
  scrapeResponse[key].planUrl = 'https://bamboo.ets.berkeley.edu/bamboo/browse/' + element.plan.key;
  scrapeResponse[key].currentBuildUrl = 'https://bamboo.ets.berkeley.edu/bamboo/browse/' + element.key;
};

var parsePlan = function(key, body) {
  body = JSON.parse(body);
  scrapeResponse[key].isBuilding = body.isBuilding;
};

var scrapePlan = function(key, url) {
  request({
    url: url,
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      parsePlan(key, body);
    }
  }).auth(username, password, true);
};

var parsePlans = function(body) {
  body = JSON.parse(body);
  if (body && body.results && body.results.result) {
    var result = body.results.result;
    result.forEach(function(element) {
      var key = element.plan.key;
      if (key === 'MYB-CLCMVPMASTER' || key === 'MYB-CLCMVPQA') {
        var realkey = key.replace('MYB-CLCMVP', '').toLowerCase();
        if (!scrapeResponse[realkey]) {
          scrapeResponse[realkey] = {};
        }
        scrapePlan(realkey, element.plan.link.href + '.json');
        parseElement(realkey, element);
      }
    });
  }
};

var sendEvent = function() {
  sharedEvents.emit('scraped', {
    bamboo: scrapeResponse
  });
};

var scrapePlans = function() {
  request({
    url: 'https://bamboo.ets.berkeley.edu/bamboo/rest/api/latest/result.json',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      parsePlans(body);
    }
  }).auth(username, password, true);
};

var init = function() {
  setInterval(sendEvent, 2000);
  setInterval(scrapePlans, 4000);
};

module.exports = {
  init: init
};
