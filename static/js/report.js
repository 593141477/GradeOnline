var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid']);

gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  if(!('s' in report)){
    $scope.data=[];
    $scope.dataLoaded = true;
    return;
  }
  var rows = [];
  var cols = [];
  var hrow = [
    {student_name: '周次'},
    {student_name: '姓名\\课程'},
  ];
  for (var i = 0; i < report.s.length; i++) {
    rows.push({student_name: report.s[i].student_name});
  }
  for (var i = 0; i < report.g.length; i++) {
    var course = report.g[i];
    var cname = 'c'+i;
    for (var j = 0; j < course.grades.length; j++) {
      rows[j][cname] = course.grades[j];
    }
    cols.push({name: cname, displayName: ''})
    hrow[0][cname] = course.date.week;
    hrow[1][cname] = course.content;
  }
  $scope.dataLoaded = true;
  $scope.data=hrow.concat(rows);

  $scope.gridOptions = {
    enableGridMenu: true,
    columnDefs: [
      { name: 'student_name', displayName: ''},
    ].concat(cols),
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
      
    ],
    data: 'data',
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
  };

}]);
