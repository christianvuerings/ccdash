(function(angular, io) {

  angular.module('ccdash.controllers', []);
  var ccdash = angular.module('ccdash', [
    'ccdash.controllers'
  ]);


  angular.module('ccdash.controllers').controller('MainController', function($scope) {

    var socket = io.connect('http://localhost');
    socket.on('ccdash', function(data) {
      console.log(data);
      $scope.data = data;
      $scope.$apply();
    });

  });

})(window.angular, window.io);

