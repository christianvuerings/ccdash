(function(angular, io) {

  angular.module('ccdash.controllers', []);
  var ccdash = angular.module('ccdash', [
    'ccdash.controllers'
  ]);


  angular.module('ccdash.controllers').controller('MainController', function($scope) {

    var host = location.origin;
    console.log('host:', host);
    var socket = io.connect(host);
    socket.on('ccdash', function(data) {
      console.log('data:', data);
      $scope.data = data;
      $scope.$apply();
    });

  });

})(window.angular, window.io);

