function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNewDateArry(timeStamp) {
  // 当前时间的处理
  var newDate = new Date();
  if(timeStamp){
     newDate = new Date(timeStamp);
  }
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());
  return [year, mont, date, hour, minu, seco];
}
function dateTimePicker(startYear, endYear, date,isArr) {
  // 返回默认显示的数组和联动数组的声明
  
  var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
  var start = startYear || 1978;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = []
  if(isArr){
     defaultDate = date
  }else{
     defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  }

  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);

  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime,
  }
}
function dateTime(dateTimeArray,val) {
  return dateTimeArray[0][val[0]] + '-' + dateTimeArray[1][val[1]] + '-' + dateTimeArray[2][val[2]] + ' ' + dateTimeArray[3][val[3]] + ':' + dateTimeArray[4][val[4]] + ':' + dateTimeArray[5][val[5]]
}
function dateToStr(datetime){ 

  var year = datetime.getFullYear();
  var month = datetime.getMonth()+1;//js从0开始取 
  var date = datetime.getDate(); 
  var hour = datetime.getHours(); 
  var minutes = datetime.getMinutes(); 
  var second = datetime.getSeconds();
  
  if(month<10){
   month = "0" + month;
  }
  if(date<10){
   date = "0" + date;
  }
  if(hour <10){
   hour = "0" + hour;
  }
  if(minutes <10){
   minutes = "0" + minutes;
  }
  if(second <10){
   second = "0" + second ;
  }
  
  var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second; //2009-06-12 17:18:05
 // alert(time);
  return time;
 }
module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  dateTime: dateTime,
  getNewDateArry: getNewDateArry,
  dateToStr,
}
