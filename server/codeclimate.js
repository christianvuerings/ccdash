var jsdom = require("jsdom");
var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var scrapeClimateResponse = {};
scrapeClimateResponse.url = 'https://codeclimate.com/github/ets-berkeley-edu/calcentral';

var sendEvent = function() {
  sharedEvents.emit('scraped.codeclimate', scrapeClimateResponse);
};

var parseDonut = function(body) {
  body = JSON.parse(body);

  scrapeClimateResponse.donut = body;

  sendEvent();
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

var scrapeGpa = function() {
  jsdom.env(
    'https://codeclimate.com/github/ets-berkeley-edu/calcentral',
    ['http://code.jquery.com/jquery.js'],
    function (errors, window) {
      if (window) {
        scrapeClimateResponse.gpa = window.$('.donut_chart .gpa .number').text();
      }
    }
  );
};

var init = function() {
  setInterval(scrapeDonut, 4000);
  setInterval(scrapeGpa, 4000);
};

module.exports = {
  init: init
};
