(function(angular) {

  angular.module('ccdash.controllers', []);
  var ccdash = angular.module('ccdash', [
    'ccdash.controllers'
  ]);


  angular.module('ccdash.controllers').controller('MainController', function($scope) {

    //var host = location.origin;

    var sockjs_url = '/echo';
    var sockjs = new SockJS(sockjs_url);

    sockjs.onmessage = function(e) {
      if (!e || !e.data) {
        return;
      }
      var data = JSON.parse(e.data);
      console.log('data:', data);
      $scope.data = data;
      $scope.$apply();
    };

  });

})(window.angular);

