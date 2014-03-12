var cheerio = require('cheerio');
var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var sendEvent = function(scrapeClimateResponse) {
  process.nextTick(function() {
    sharedEvents.emit('scraped.codeclimate', scrapeClimateResponse);
  });
};

var scrapeGpa = function(scrapeClimateResponse) {
  request({
    url: 'https://codeclimate.com/github/ets-berkeley-edu/calcentral',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        var $ = cheerio.load(body);
        scrapeClimateResponse.gpa = $('.donut_chart .gpa .number').text();
        sendEvent(scrapeClimateResponse);
      });
    }
  });
};

var parseDonut = function(body) {
  body = JSON.parse(body);

  var scrapeClimateResponse = {};
  scrapeClimateResponse.url = 'https://codeclimate.com/github/ets-berkeley-edu/calcentral';
  scrapeClimateResponse.donut = body;

  scrapeGpa(scrapeClimateResponse);
};

var timeout;
var scrapeDonut = function() {
  request({
    url: 'https://codeclimate.com/repos/50787003f3ea001d6a001725/donut.json',
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        parseDonut(body);
      });
    }
  });
  timeout = setTimeout(scrapeDonut, 4000);
};

var init = function() {
  scrapeDonut();
};

module.exports = {
  init: init
};
