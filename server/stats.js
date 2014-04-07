var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var sendEvent = function(scrapeResponse) {
  sharedEvents.emit('scraped.stats', scrapeResponse);
};

var parseStats = function(stats) {
  stats = JSON.parse(stats);

  // hot plate
  stats.hot_plate.average_time = (stats.hot_plate.total_warmup_time / stats.hot_plate.total_warmups_processed).toFixed(1);
  outstanding = stats.hot_plate.total_warmups_requested - stats.hot_plate.total_warmups_processed;
  if (outstanding) {
    stats.hot_plate.outstanding_warmups = outstanding;
    stats.hot_plate.state = "ccdash-state-warning";
  } else {
    stats.hot_plate.state = "ccdash-state-successful";
  }

  // live updates
  averageTime = (stats.live_updates_warmer.total_warmup_time / stats.live_updates_warmer.total_warmups_requested).toFixed(1);
  stats.live_updates_warmer.average_time = averageTime;
  if (averageTime > 5) {
    stats.live_updates_warmer.state = "ccdash-state-warning";
  } else {
    stats.live_updates_warmer.state = "ccdash-state-successful";
  }

  sendEvent(stats);
};

var scrapeStats = function() {
  request({
    url: process.env.STATS_URL || "https://calcentral.berkeley.edu/api/stats",
    rejectUnauthorized: false
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      process.nextTick(function() {
        parseStats(body);
      });
    }
  });
};

var init = function() {
  setInterval(scrapeStats, 10000);
};

module.exports = {
  init: init
};


