(function(angular, io, Highcharts) {

  angular.module('ccdash.controllers', []);
  var ccdash = angular.module('ccdash', [
    'ccdash.controllers'
  ]);


  angular.module('ccdash.controllers').controller('MainController', function($scope) {

    var host = location.origin;
    var socket = io.connect(host);
    socket.on('ccdash', function(data) {
      console.log('data:', data);
      $scope.data = data;
      $scope.$apply();
    });

  });

  angular.module('ccdash.controllers').controller('CodeClimateController', function($scope) {

    var donut;

    var initDonut = function() {
      donut = new Highcharts.Chart({
        chart: {
          backgroundColor: 'transparent',
          reflow: false,
          renderTo: 'ccdash-codeclimate-donut',
          type: 'pie'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '',
          align: 'center',
          verticalAlign: 'middle',
          style: {
            color: '#fff',
            fontSize: '24px',
            fontWeight: 'bold'
          },
          y: -5
        },
        subtitle: {
          text: '',
          align: 'center',
          verticalAlign: 'middle',
          style: {
            color: '#fff',
            fontSize: '16px'
          },
          y: 25
        },
        plotOptions: {
          pie: {
            borderWidth: 0,
            shadow: false
          }
        },
        tooltip: {
          valueSuffix: '',
          hideDelay: 0
        },
        series: [{
          name: 'Classes / modules',
          data: {},
          innerSize: '70%',
          dataLabels: {
            distance: -13,
            color: '#fff',
            style: {
              fontSize: '16px',
              fontWeight: 'bold'
            }
          }
        }]
      });
    };

    var watchDonut = function() {
      $scope.$watch('data.codeclimate', function(newValue) {
        if (!donut) {
          return;
        }
        if (newValue.donut) {
          donut.series[0].setData(newValue.donut, true);
        }
        if (newValue.gpa) {
          donut.setTitle({
            text: newValue.gpa
          }, {
            text: 'GPA'
          });
        }
      });
    };

    angular.element(document).ready(function () {
      initDonut();
      watchDonut();
    });

  });

})(window.angular, window.io, window.Highcharts);

