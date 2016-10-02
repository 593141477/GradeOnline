var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.importer']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.dirty=-1;
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
  $scope.action_submit = function ($event) {
    $http.post('./update',JSON.stringify({class_id:class_id, data:$scope.data})).then(function (response) {
      if (response.data){
        $scope.dirty = 0;
        alert("Submitted Successfully!");
      }
    }, function (response) {
        alert("Error!!!");
    });
  };

  $scope.gridOptions = {
    enableGridMenu: true,
    enableCellEdit: true,
    columnDefs: [
      { name: 'student_name', displayName: '姓名'},
      { name: 'student_id', displayName: '学号'},
      { name: 'formal_class', displayName: '行政班级'},
    ],
    gridMenuCustomItems: [
      {
        title: '提交',
        action: $scope.action_submit,
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
      var displayName2name = {};
      $scope.gridOptions.columnDefs.forEach(function(value){
        displayName2name[value.displayName] = value.name;
      });
      newObjects.forEach(function(row){
        for(var prop in row){
          if(displayName2name[prop]!==null)
            row[displayName2name[prop]]=row[prop];
        };
      });
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
  $scope.$watch('data', function(n,o){
    $scope.dirty++;
  });
  $scope.submit = function(){
    $scope.action_submit();
  };

}]);
