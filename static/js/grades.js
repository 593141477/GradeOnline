var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.edit']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.data = schedule;
  $scope.dataLoaded = true;

  weekList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  for(i in weekList){
    weekList[i] = {id: weekList[i], week: weekList[i]};
  }
  dayOfWeek = ["一","二","三","四","五","六","日"];
  for(i in dayOfWeek){
    dayOfWeek[i] = {id: dayOfWeek[i], dow: dayOfWeek[i]};
  }
  classOfDay = [1,2,3,4,5,6,7];
  for(i in classOfDay){
    classOfDay[i] = {id: classOfDay[i], cod: classOfDay[i]};
  }

  metaClassList = [];
  for(i in class_list)
  {
      metaClassList[i] = {id:class_list[i]._id, class_id:class_list[i]._id}
  }

  metaTeacherList = [];
  for(i in teacher_list)
  {
      metaTeacherList[i] = {id:teacher_list[i]._id, teacher:teacher_list[i].name}
  }

  $scope.gridOptions = {
    enableGridMenu: true,
    columnDefs: [
      // { name: 'date', displayName:'上课日期',type: 'shortdate', cellFilter: 'date:\'MM/dd\'', enableCellEdit: true},
      { name: 'week', displayName:'周次', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%', editDropdownValueLabel: 'week', editDropdownOptionsArray:weekList},
      { name: 'dow', displayName:'星期', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%', editDropdownValueLabel: 'dow', editDropdownOptionsArray:dayOfWeek},
      { name: 'cod', displayName:'节数', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%', editDropdownValueLabel: 'cod', editDropdownOptionsArray:classOfDay},
      { name: 'class_id', displayName:'班级', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%', editDropdownValueLabel: 'class_id', editDropdownOptionsArray:metaClassList},
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
