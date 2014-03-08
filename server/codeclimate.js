var jsdom = require("jsdom");
var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var sendEvent = function(scrapeClimateResponse) {
  sharedEvents.emit('scraped.codeclimate', scrapeClimateResponse);
};

var scrapeGpa = function(scrapeClimateResponse) {
  jsdom.env(
    'https://codeclimate.com/github/ets-berkeley-edu/calcentral',
    ['http://code.jquery.com/jquery.js'],
    function (errors, window) {
      if (window && window.$) {
        scrapeClimateResponse.gpa = window.$('.donut_chart .gpa .number').text();
        sendEvent(scrapeClimateResponse);
      }
    }
  );
};

var parseDonut = function(body) {
  body = JSON.parse(body);

  var scrapeClimateResponse = {};
  scrapeClimateResponse.url = 'https://codeclimate.com/github/ets-berkeley-edu/calcentral';
  scrapeClimateResponse.donut = body;

  scrapeGpa(scrapeClimateResponse);
};

var scrapeDonut = function() {
  request({
    url: 'https://codeclimate.com/repos/50787003f3ea001d6a001725/donut.json',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      parseDonut(body);
    }
  });
};

var init = function() {
  setInterval(scrapeDonut, 4000);
};

module.exports = {
  init: init
};
