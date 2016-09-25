var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.edit']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.data = grades;
  $scope.dataLoaded = true;

  $scope.gridOptions = {
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
        action: function ($event) {
          $http.post('./update',JSON.stringify({schedule_id:schedule_id,data:$scope.data})).then(function (response) {
            if (response.data)
              alert("Submitted Successfully!");
          }, function (response) {
              alert("Error!!!");
          });
        },
        order: 410
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
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };
}]);
