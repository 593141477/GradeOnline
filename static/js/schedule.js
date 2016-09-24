var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.edit']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.data = [];//students;
  $scope.dataLoaded = true;

  metaClassList = [];
  for(i in class_list)
  {
      metaClassList[i] = {id:class_list[i], class_id:class_list[i]}
  }

  metaTeacherList = [];
  for(i in teacher_list)
  {
      metaTeacherList[i] = {id:teacher_list[i], teacher:teacher_list[i]}
  }

  $scope.gridOptions = {
    enableGridMenu: true,
    columnDefs: [
      { name: 'date', displayName:'上课日期',type: 'shortdate', cellFilter: 'date:\'MM/dd\'', enableCellEdit: true},
      { name: 'class_id', displayName:'课号', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%', editDropdownValueLabel: 'class_id', editDropdownOptionsArray:metaClassList},
      { name: 'teacher', displayName: '主讲教师', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%', editDropdownValueLabel: 'teacher', editDropdownOptionsArray:metaTeacherList}
    ],
    gridMenuCustomItems: [
      {
        title: 'submit',
        action: function ($event) {
          $http.post('/admin/schedule/update',JSON.stringify($scope.data)).then(function (response) {
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
      },
      {
        title: 'new',
        action: function ($event) {
          $scope.data = $scope.data.concat([{}]);
        }
      }
    ],
    data: 'data',
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };
}]);
