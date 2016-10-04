var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.edit']);

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
    metaClassList[i] = {id:class_list[i]._id, class_name:class_list[i].name}
}

metaTeacherList = [];
for(i in teacher_list)
{
    metaTeacherList[i] = {id:teacher_list[i]._id, teacher:teacher_list[i].name}
}
gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  $scope.data = schedule;
  $scope.dataLoaded = true;


  $scope.gridOptions = {
    enableCellEditOnFocus: true,
    enableGridMenu: true,
    columnDefs: [
      // { name: 'date', displayName:'上课日期',type: 'shortdate', cellFilter: 'date:\'MM/dd\'', enableCellEdit: true},
      { name: 'date.week', displayName:'周次', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%', editDropdownValueLabel: 'week', editDropdownOptionsArray:weekList},
      { name: 'date.dow', displayName:'星期', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%', editDropdownValueLabel: 'dow', editDropdownOptionsArray:dayOfWeek},
      { name: 'date.cod', displayName:'节数', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%', editDropdownValueLabel: 'cod', editDropdownOptionsArray:classOfDay},
      { name: 'class_id', displayName:'班级', cellFilter:'classDisplay', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%', editDropdownValueLabel: 'class_name', editDropdownOptionsArray:metaClassList},
      { name: 'content', displayName: '内容', enableCellEdit: true, width: '15%'},
      { name: 'teacher', displayName: '主讲教师', cellFilter:'teacherDisplay', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%', editDropdownValueLabel: 'teacher', editDropdownOptionsArray:metaTeacherList},
    ],
    gridMenuCustomItems: [
      {
        title: '提交',
        action: function ($event) {
          $http.post('schedule/update',JSON.stringify($scope.data)).then(function (response) {
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
      },
      {
        title: '增加',
        action: function ($event) {
          $scope.data = $scope.data.concat([{}]);
        },
        order: 320
      }
    ],
    data: 'data',
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
  };
}])

.filter('teacherDisplay', function () {
  return function (value) {
    for(i in metaTeacherList)
      if(metaTeacherList[i].id==value)
        return metaTeacherList[i].teacher;
    return value;
  };
})
.filter('classDisplay', function () {
  return function (value) {
    for(i in metaClassList)
      if(metaClassList[i].id==value)
        return metaClassList[i].class_name;
    return value;
  };
});
