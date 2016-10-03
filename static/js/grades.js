var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.edit']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.dirty=-1;
  $scope.data = grades;
  $scope.dataLoaded = true;
  $scope.action_submit = function ($event) {
    var data = $scope.data;
    for (var i = data.length - 1; i >= 0; i--) {
      data[i].grade = data[i].grade || 0;
    }
    // console.log(data)
    $http.post('./update',JSON.stringify({schedule_id:schedule_id,data:$scope.data})).then(function (response) {
      if (response.data){
        $scope.dirty = 0;
        alert("Submitted Successfully!");
      }
    }, function (response) {
        alert("Error!!!");
    });
  };

  $scope.gridOptions = {
    enableCellEditOnFocus: true,
    enableGridMenu: true,
    columnDefs: [
      { name: 'student_name',enableCellEdit:false, displayName: '姓名'},
      { name: 'student_id',enableCellEdit:false, displayName: '学号'},
      { name: 'grade', enableCellEdit: true,displayName: '成绩',
        editableCellTemplate: '<div><form name="inputForm"><input type="number" min="0" max="100" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'},
    ],
    gridMenuCustomItems: [
      {
        title: '提交',
        action: $scope.action_submit,
        order: 410
      },
    ],
    data: 'data',
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef){
        // console.log(rowEntity)
        $scope.dirty++;
      });
    }
  };
  $scope.$watch('data', function(n,o){
    $scope.dirty++;
    // console.log($scope.dirty)
  });
  $scope.submit = function(){
    $scope.action_submit();
  };
  $scope.test = function(){
    console.log($scope.data)
  };
}]);
