var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.importer']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  if(typeof(students[0]) == "undefined"){
    $scope.data = [];
  }
  else if(typeof(students[0].students) == "undefined"){
    $scope.data = [];
  }
  else{
    $scope.data=students[0].students;
  }
  for (var s in $scope.data){
    $scope.data[s]['class_id'] = class_id;
  }
  $scope.dataLoaded = true;

  $scope.gridOptions = {
    enableGridMenu: true,
    columnDefs: [
      { name: 'class_id', visible:false},
      { name: 'student_name', displayName: '姓名'},
      { name: 'student_id', displayName: '学号'}
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
      for (var s in $scope.data){
        $scope.data[s]['class_id'] = class_id;
      }

    },
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
  };

  // $http.get('http://ui-grid.info/data/100.json').success(function(data) {
  //   $scope.data = data;
  //   $scope.dataLoaded = true;
  // });
}]);
