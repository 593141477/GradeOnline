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

  $scope.action_export = function(){
    function datenum(v, date1904) {
      if(date1904) v+=1462;
      var epoch = Date.parse(v);
      return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }
     
    function sheet_from_array_of_arrays(data, opts) {
      var ws = {};
      var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
      for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
          if(range.s.r > R) range.s.r = R;
          if(range.s.c > C) range.s.c = C;
          if(range.e.r < R) range.e.r = R;
          if(range.e.c < C) range.e.c = C;
          var cell = {v: data[R][C] };
          if(cell.v == null) continue;
          var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
          
          if(typeof cell.v === 'number') cell.t = 'n';
          else if(typeof cell.v === 'boolean') cell.t = 'b';
          else if(cell.v instanceof Date) {
            cell.t = 'n'; cell.z = XLSX.SSF._table[14];
            cell.v = datenum(cell.v);
          }
          else cell.t = 's';
          
          ws[cell_ref] = cell;
        }
      }
      if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
      return ws;
    }
     
    /* original data */
    var data = $scope.build_export_data();
    var ws_name = class_id;

    // localStorage['export'] = JSON.stringify(data);
    // return;
     
    function Workbook() {
      if(!(this instanceof Workbook)) return new Workbook();
      this.SheetNames = [];
      this.Sheets = {};
    }
     
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
     
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "export.xlsx")
  };
  $scope.build_export_data = function(){
    var result = [], tmp = [];
    $scope.data.forEach(function(row){
      tmp = [];
      for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
        var cdef = $scope.gridOptions.columnDefs[i];
        tmp.push((cdef.name in row) ? row[cdef.name] : '');
      }
      result.push(tmp);
    });
    return result;
  };

  $scope.gridOptions = {
    enableGridMenu: true,
    columnDefs: [
      { name: 'student_name', displayName: ''},
    ].concat(cols),
    gridMenuCustomItems: [
      {
        title: '导出',
        action: $scope.action_export,
        order: 420
      },
      
    ],
    data: 'data',
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
  };
}]);
