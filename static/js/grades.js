var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.importer']);

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
    var ws_name = "Sheet1";
     
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
    for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
      var cdef = $scope.gridOptions.columnDefs[i];
      tmp.push(cdef.displayName);
    }
    result.push(tmp);
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
      {
        title: '导出',
        action: $scope.action_export,
        order: 420
      },
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
        if(!('student_id' in row))return;
        $scope.data.forEach(function(tr){
          if(tr['student_id'] == row['student_id']){
            try{
              tr['grade']=parseFloat(row['grade'],10);
              if(isNaN(tr['grade']))
                throw 'Not a number';
            }catch(err){
              tr['grade']='';
            }
            if(tr['grade']>100)
              tr['grade']=100;
            else if(tr['grade']<0)
              tr['grade']=0;
          }
        })
      });
    },
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
  window.onbeforeunload = function(){
    return $scope.dirty<=0 ? null : '修改尚未保存，是否退出？';
  }
}]);
