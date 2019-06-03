# desktopCalendar
A desktop calendar with support for 3 different calendars that can display offline events based on any calendar.
The calendars is introduced by [moment.js](https://github.com/moment/moment) and lateral libraries like [jalaali](https://github.com/jalaali/moment-jalaali) and [hijri](https://github.com/xsoh/moment-hijri).

# Setup
Include the desktopCalendar stylesheet in the head section of your webpage:
```html
<link rel="stylesheet" href="src/css/desktopCalendar.css">
```
and add one of the themes.
```html
<link rel="stylesheet" href="src/css/desktopCalendarTheme.default.min.css">
<link rel="stylesheet" href="src/css/desktopCalendarTheme.glass.min.css">
<link rel="stylesheet" href="src/css/desktopCalendarTheme.light.min.css">
<link rel="stylesheet" href="src/css/desktopCalendarTheme.shiny.min.css">
```
Include the moment.js script in the head section of your webpage :
```js
<script src="libs/moment.min.js"></script>
```
for hjri calendar add script
```js
<script src="libs/moment-hijri.js"></script>
```
for jalali calendar add script
```js
<script src="libs/moment-jalaali.js"></script>
```
Include the desktopCalendar script at the bottom of the body of your webpage:
```js
<script src="src/js/desktopCalendar.min.js"></script>
```
# Usage
In order to display the viewer, you need to attach it to a HTML element.
```html
<div id="desktopCalendar"></div>
```
Then call the script when document is ready
```js
var myModal = new desktopCalendar({
          selector       : "#multiCaleder" ,
          firstCalendar  : {
            momentType : "jYYYY-jMM-jDD",
            title      : "هجری شمسی",
            monthTitle : ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"
          },
          secondCalendar  : {
            momentType : "YYYY-MM-DD",
            title      : "میلادی"
          },
          thirdCalendar  : {
            momentType : "iYYYY-iMM-iDD",
            title      : "هجری قمری",
            monthTitle : ["محرم","صفر","ربیع الاول","ربیع الثانی","جمادی الاول","جمادی الثانی","رجب","شعبان","رمضان","شوال","ذیقعده","ذیحجه"]
          },
          dayName        : { su  : "یک شنبه" ,  mo  : "دو شنبه" ,   tu  : "سه شنبه" ,   we  : "چهار شنبه" ,   th  : "پنچ شنبه" ,   fr  : "جمعه" ,  sa  : "شنبه" },
          direction      : "rtl",
          startday       : "sa",
          weekendHoliday : "fr",
          lang     : {
            events   : "مناسبت",
            calender : "تقویم",
            holiday  : "تعطیل"
          }
      });
```
# Options
| Option | Default |Description |
| --- | --- | --- |
| selector| - | target element select in html page |
| firstCalendar| {} | config object to first calendar |
| secondCalendar| {} | config object to second calendar|
| thirdCalendar| {} | config object to third calendar|
| direction| "ltr" | arrangement of elements ( ltr or rtl )|
| dayName| { su  : "su" ,  mo  : "mo" ,  tu  : "tu" ,  we  : "we" ,  th  : "th" ,  fr  : "fr" ,         sa  : "sa" } | day name for title calendar tabel|
| weekendHoliday| "fr" | set fixed holidays in weekend|
| icons| { close : "x" , leftArrow : "&lsaquo;" , rightArrow  : "&rsaquo;", menu : "&#9776;" } | set calendar icons|
| date| today | init date|
| lang| { events   : "events",   calendar : "calendar",    holiday  : "holiday"  } | set language words |
| theme| "default" | set theme |
| coloring| "midnightBlue" | set coloring in theme|
| onChange|  | on change run function|

# firstCalendar , secondCalendar ,  thirdCalendar options
| Option | Default | Description |
| --- | --- | --- |
| momentType | "YYYY-MM-DD" | moment.js and same libs by format |
| title | "" | calendar title |
| eventSrc | "" | event list as json |
| numbering | Null | output of numbering  |
| monthTitle | Null | month titles as array |
| direction | "ltr" | arrangement of calendar elements ( ltr or rtl ) |


# Demo
