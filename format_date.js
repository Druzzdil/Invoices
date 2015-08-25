var today = new Date();
console.log(today.valueOf());
var dd = today.getDate();
var MM = today.getMonth()+1;
if(dd<10){dd='0'+dd}
if(MM<10){MM='0'+MM}
var yyyy = today.getFullYear();
console.log('----------------------------------');
//var minMilli = 1000 * 60;
//var hrMilli = minMilli * 60;
//var dyMilli = hrMilli * 24;
//
//var testDate = new Date("June 1, 1990");
//var ms = Date.parse(testDate);
//var days = Math.round(ms / dyMilli);
//
//var dateStr = "";
//dateStr += "There are " + days + " days ";
//dateStr += "between 01/01/1970 and " + testDate;
//console.log(dateStr);

var d = new Date();
d.setDate(today.getDate()+366);

d.toUTCString();
console.log(d);



