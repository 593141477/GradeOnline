var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.importer']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.data = students;
  $scope.dataLoaded = true;

  $scope.gridOptions = {
    exporterMenuCsv: false,
    enableGridMenu: true,
    columnDefs: [
      { name: 'class_id' },
      { name: 'students' },
    ],
    gridMenuCustomItems: [
      {
        title: 'submit',
        action: function ($event) {
          $http.post('/admin/classes/update',JSON.stringify($scope.data)).then(function (response) {
            if (response.data)
              alert("Submitted Successfully!");
          }, function (response) {
              alert("Error!!!");
          });
        },
        order: 210
      },
      {
        title: 'clean',
        action: function ($event) {
          $scope.data = [];
        },
        order: 310
      }
    ],
    data: 'data',
    importerDataAddCallback: function ( grid, newObjects ) {
      $scope.data = $scope.data.concat( newObjects );
    },
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };

  // $http.get('http://ui-grid.info/data/100.json').success(function(data) {
  //   $scope.data = data;
  //   $scope.dataLoaded = true;
  // });
}]);
