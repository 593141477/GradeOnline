var gridApp = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.importer']);

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
gridApp.controller('MainCtrl', ['$scope', '$http', '$interval', '$filter', function ($scope, $http, $interval, $filter) {

  $scope.dirty=-1;
  $scope.data = schedule;
  $scope.dataLoaded = true;

  $scope.action_submit = function ($event) {
    $http.post('schedule/update',JSON.stringify($scope.data)).then(function (response) {
      if (response.data){
        $scope.dirty=0;
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
    var ws_name = "Schedule";
     
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
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "schedule.xlsx")
  };
  $scope.build_export_data = function(){
    var result = [], tmp = [];
    for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
      var cdef = $scope.gridOptions.columnDefs[i];
      if(cdef.name == 'DeleteOp') continue;
      tmp.push(cdef.displayName);
    }
    result.push(tmp);
    $scope.data.forEach(function(row){
      tmp = [];
      for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
        var cdef = $scope.gridOptions.columnDefs[i];
        if(cdef.name == 'DeleteOp') continue;
        var filter = ('cellFilter' in cdef) ? $filter(cdef.cellFilter) : function(x){return x;};
        var d = '';
        try{
          eval('d=row.'+cdef.name);
          d = d || '';
        }catch(exception) {}
        tmp.push(filter(d));
      }
      result.push(tmp);
    });
    return result;
  };
  $scope.DeleteRow = function(row) {
    var index = $scope.data.indexOf(row.entity);
    $scope.data.splice(index, 1);
    $scope.dirty++;
  };
  $scope.gridOptions = {
    enableCellEditOnFocus: true,
    enableGridMenu: true,
    columnDefs: [
      // { name: 'date', displayName:'上课日期',type: 'shortdate', cellFilter: 'date:\'MM/dd\'', enableCellEdit: true},
      { name: 'date.week', displayName:'周次', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%', editDropdownValueLabel: 'week', editDropdownOptionsArray:weekList},
      { name: 'date.dow', displayName:'星期', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%', editDropdownValueLabel: 'dow', editDropdownOptionsArray:dayOfWeek},
      { name: 'date.cod', displayName:'节数', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%', editDropdownValueLabel: 'cod', editDropdownOptionsArray:classOfDay},
      { name: 'class_id', displayName:'班级', cellFilter:'classDisplay', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '30%', editDropdownValueLabel: 'class_name', editDropdownOptionsArray:metaClassList},
      { name: 'content', displayName: '内容', enableCellEdit: true, width: '15%'},
      { name: 'teacher', displayName: '主讲教师', cellFilter:'teacherDisplay', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%', editDropdownValueLabel: 'teacher', editDropdownOptionsArray:metaTeacherList},
      {
          name: 'DeleteOp',
          displayName: '删除',
          width: '10%',
          cellTemplate: '<button class="btn primary" ng-click="grid.appScope.DeleteRow(row)">删除</button>'
      }
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
      {
        title: '清空',
        action: function ($event) {
          $scope.data = [];
        },
        order: 330
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
    importerDataAddCallback: function ( grid, newObjects ) {
      var displayName2name = {};
      $scope.gridOptions.columnDefs.forEach(function(value){
        displayName2name[value.displayName] = value.name;
      });
      var newData = [];
      newObjects.forEach(function(row){
        var item = {date: {} };
        for(var prop in row){
          if(displayName2name[prop]!==null)
            row[displayName2name[prop]]=row[prop];
        };
        try  {
          function mapping(value, arr, field) {
            for (var i = arr.length - 1; i >= 0; i--) {
              if(arr[i][field] == value)
                return arr[i]['id'];
            }
            throw value+' not found in '+field;
          }
          for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
            var cdef = $scope.gridOptions.columnDefs[i];
            if(cdef.name == 'DeleteOp') continue;
            if(!(cdef.name in row))
              throw cdef.name+' is empty!'
            var data = (''+row[cdef.name]).trim();
            if(data===''){
              console.log('empty line found');
              return;
            }
            switch(cdef.name){
              case 'class_id':
                data = mapping(data, metaClassList, 'class_name');
                break;
              case 'teacher':
                data = mapping(data, metaTeacherList, 'teacher');
                break;
              case 'date.week':
                data = mapping(data, weekList, 'week');
                break;
              case 'date.dow':
                data = mapping(data, dayOfWeek, 'dow');
                break;
              case 'date.cod':
                data = mapping(data, classOfDay, 'cod');
                break;
            }
            eval('item.'+cdef.name+'=data');
          }
          newData.push(item);
        }
        catch(exception) {
          alert(exception);
          throw 'abort';
        }
      });
      $scope.data = newData;
    },
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef){
        $scope.dirty++;
        // console.log($scope.dirty);
      });
    }
  };
  $scope.$watch('data', function(n,o){
    $scope.dirty++;
    // console.log($scope.dirty);
  });
  $scope.submit = function(){
    $scope.action_submit();
  };
  window.onbeforeunload = function(){
    return $scope.dirty<=0 ? null : '修改尚未保存，是否退出？';
  }
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
