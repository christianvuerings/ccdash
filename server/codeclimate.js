var cheerio = require('cheerio');
var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var sendEvent = function(scrapeClimateResponse) {
  process.nextTick(function() {
    sharedEvents.emit('scraped.codeclimate', scrapeClimateResponse);
  });
};

var timeout;
var scrapeGpa = function() {
  var url = 'https://codeclimate.com/github/ets-berkeley-edu/calcentral';
  request({
    url: url,
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        var $ = cheerio.load(body);
        var scrapeClimateResponse = {
          gpa: $('.donut_chart .gpa .number').text(),
          url: url
        };
        sendEvent(scrapeClimateResponse);
      });
    }
  });
  timeout = setTimeout(scrapeGpa, 21600000);
};

var init = function() {
  scrapeGpa();
};

module.exports = {
  init: init
};
