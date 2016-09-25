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
  $scope.dataLoaded = true;

  $scope.gridOptions = {
    enableGridMenu: true,
    columnDefs: [
      { name: 'student_name', displayName: '姓名'},
      { name: 'student_id', displayName: '学号'},
      { name: 'formal_class', displayName: '行政班级'},
    ],
    gridMenuCustomItems: [
      {
        title: '提交',
        action: function ($event) {
          $http.post('/admin/classes/update',JSON.stringify({class_id:class_id, data:$scope.data})).then(function (response) {
            if (response.data)
              alert("Submitted Successfully!");
          }, function (response) {
              alert("Error!!!");
          });
        },
        order: 410
      },
      // {
      //   title: '增加',
      //   action: function ($event) {
      //     $scope.data = $scope.data.concat([{}]);
      //   },
      //   order: 320
      // },
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
      // console.log('importerDataAddCallback');
      // console.log(newObjects)
      $scope.data = $scope.data.concat( newObjects );

    },
    // importerProcessHeaders: function( grid,headerArray ) {
    //   console.log('importerProcessHeaders');
    //   console.log(headerArray);
    //   DBG = headerArray;
    //   headerArray.forEach( function( value, index ) {
    //     console.log(value)
    //   });
    //   return headerArray;
    // },
    // importerObjectCallback: function ( grid, newObject ) {
    //   console.log('importerObjectCallback');
    //   console.log(newObject);
    //   return newObject;
    // },
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
  };

  // $http.get('http://ui-grid.info/data/100.json').success(function(data) {
  //   $scope.data = data;
  //   $scope.dataLoaded = true;
  // });
}]);
