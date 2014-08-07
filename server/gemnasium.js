var cheerio = require('cheerio');
var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var sendEvent = function(gemnasiumResponse) {
  process.nextTick(function() {

    var uptodate = parseInt(gemnasiumResponse.numbers[0], 10);
    var notlast = parseInt(gemnasiumResponse.numbers[1], 10);
    var outdated = parseInt(gemnasiumResponse.numbers[2], 10);
    var state = '';
    if (outdated > 0) {
      state = 'failed';
    } else if (notlast > 0) {
      state = 'warning';
    } else {
      state = 'successful';
    }

    sharedEvents.emit('scraped.gemnasium', {
      uptodate: uptodate,
      notlast: notlast,
      outdated: outdated,
      state: state,
      url: gemnasiumResponse.url
    });
  });
};

var timeout;
var scrapeNumbers = function() {
  var url = 'https://gemnasium.com/ets-berkeley-edu/calcentral';
  request({
    url: url,
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        var $ = cheerio.load(body);
        //console.log($('.dependencies-counts .round').map(function() {return $(this).text();}));
        var gemnasiumResponse = {
          numbers: $('.dependencies-counts .round').map(function() {return $(this).text();}),
          url: url
        };
        sendEvent(gemnasiumResponse);
      });
    }
  });
  timeout = setTimeout(scrapeNumbers, 4000);
};

var init = function() {
  scrapeNumbers();
};

module.exports = {
  init: init
};
