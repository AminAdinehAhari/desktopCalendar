(function() {
  // Define our constructor
  this.dayName = [ "su" , "mo" , "tu" , "we" , "th" , "fr" , "sa" ];
  this.dayInterval = null;
  this.dayCounter  = 0;
  this.startDay = null;
  this.endDay = null;
  this.desktopCalendar = function() {
      // Define option defaults
      var defaults = {
        selector       : "" ,
        firstCalendar  : { },
        secondCalendar : { },
        thirdCalendar  : { },
        endLoading     : false ,
        direction      : "ltr",
        dayName        : {
          su  : "su" ,
          mo  : "mo" ,
          tu  : "tu" ,
          we  : "we" ,
          th  : "th" ,
          fr  : "fr" ,
          sa  : "sa"
        },
        startday       : "su" ,
        weekendHoliday : "fr",
        icons          : {} ,
        date           : "" ,
        lang           : {},
        breakingPoint  : 600 ,
        theme          : "default" ,
        coloring       : "midnightBlue" ,
        defaultIcon    : {
          close       :   "x" ,
          leftArrow   : "&lsaquo;" ,
          rightArrow  : "&rsaquo;",
          menu        : "&#9776;"
        },
        defaultLag     : {
          events   : "events",
          calendar : "calendar",
          holiday  : "holiday"
        },
        momentConf     : null,
        onChange       : null,
        eventList      : []
      };
      if (arguments[0] && typeof arguments[0] === "object") {
        this.options = extendDefaults(defaults, arguments[0]);
        this.options.defaultIcon = extendDefaults(this.options.defaultIcon, this.options.icons);
        this.options.defaultLag  = extendDefaults(this.options.defaultLag, this.options.lang);
        this.options = setCalendarDir(this.options);
      }

      // get month title ----------
      calendarMonthTitle.call(this);
      // get default event --------
      try {
        calendarEventList.call(this);
      } catch (e) {
        console.log(e);
        ths.options.endLoading = true;
      }

      var ths = this;
      var cunt = setInterval(function () {
        if (ths.options.endLoading) {
          if(ths.options.selector !== null ) {
            ths.options.selecItem =  document.querySelector(ths.options.selector);
            try {
              ths.createThemplate();
            } catch (e) {
              console.log(e);
            }
          }
          clearInterval(cunt);
        }
      }, 500);

      return this;
  }
  // --------------
  // Public Methods
  desktopCalendar.prototype.createThemplate = function() {
    this.options.selecItem.classList.add("desktopCalendar");
    var themClass = getThemeClass(this.options);
    this.options.selecItem.classList.add(themClass);
    var coloring = getColoringClass(this.options);
    this.options.selecItem.classList.add(coloring);
    var dir = this.options.direction;
    this.options.selecItem.setAttribute("lang-dir", dir );
    this.options.selecItem.innerHTML = creatHtmlStructer( this.options );
    setCurrentDate.call(this);

    var ths = this;

    delegate( this.options.selecItem , "click", "input.dc-yearInput", function(event) {
        showYearModal.call(ths);
    });

    delegate( this.options.selecItem , "click", "input.dc-monthInput", function(event) {
        showMonthModal.call(ths);
    });

    delegate( this.options.selecItem , "click", "button.dc--close", function(event) {
        hiddenModal(this, ths.options.selecItem );
    });

    delegate( this.options.selecItem , "click", "button.dc--toggleSidebar", function(event) {
        toggleSidebar( ths.options );
    });

    delegate( this.options.selecItem , "change", "input.dc-monthInput", function(event) {
      resetingCalendar.call(ths);
    });

    delegate( this.options.selecItem , "click", ".month-item", function(event) {
       onChangeMonth(ths,this.getAttribute("month-index"));
    });

    delegate( this.options.selecItem , "click", ".year-item", function(event) {
      var year = this.getAttribute("year-index");
      onChangeYear(ths,year);
    });

    delegate( this.options.selecItem , "click", ".dc--previwPageYear", function(event) {
      var year = parseInt( ths.options.selecItem.querySelectorAll(".dc--yearModalContent>.year-item:last-child")[0].getAttribute("year-index") ) + 8;
      yearFilling(ths.options , year );
    });

    delegate( this.options.selecItem , "click", ".dc--nextPageYear", function(event) {
      var year =  parseInt( ths.options.selecItem.querySelectorAll(".dc--yearModalContent>.year-item:first-child")[0].getAttribute("year-index") ) - 8;
      yearFilling(ths.options , year );
    });

    delegate( this.options.selecItem , "click", "td.calendar-day", function(event) {
        selectTD(ths.options,this);
    });

    window.onresize = function(event) {
      resizeWindow(ths.options);
    };
    resizeWindow(ths.options);
 }

  desktopCalendar.prototype.setColoring = function(color){
    removeColorClass(this.options);
    this.options.coloring = color;
    addColorClass(this.options);
  }

  desktopCalendar.prototype.setTheme = function(theme,color){
    removeThemeClass(this.options);
    this.options.theme = theme;
    addThemeClass(this.options);
    this.setColoring(color);
  }

  desktopCalendar.prototype.setYear = function(year){
    this.options.selecItem.querySelectorAll("input.dc-yearInput")[0].value = year;
    onChangeYear(this,year);
  }

  desktopCalendar.prototype.setMonth = function(month){
    if (parseInt(month) > 0 && parseInt(month) <= 12 ) {
       onChangeMonth(this,month);
    }
  }

  desktopCalendar.prototype.destroy = function(){
    this.options.selecItem.innerHTML = '';
  }

  desktopCalendar.prototype.addEvent = function(calType,date,title,holiday=0){
    var type = "firstCalendar";
    if (calType == "firstCalendar") {
       type = "firstCalendar";
    }else if (calType == "secondCalendar") {
       type = "secondCalendar";
    }else if (calType == "thirdCalendar") {
       type = "thirdCalendar";
    }
    var item = {};
    item["type"] = type;
    item["title"] = title;
    item["date"] = date;
    item["holiday"] = ( holiday == "1" || holiday == 1 ) ? 1 : 0;
    list = this.options.eventList;
    list.push(item);
    this.options.eventList = list;
    addCustomEventList(this.options);
  }

  desktopCalendar.prototype.addEvents = function(clist){
    if (Array.isArray(clist)) {
      list = this.options.eventList;
      for (var i = 0; i < clist.length; i++) {
        if ( "type" in clist[i] &&
             "title" in clist[i] &&
             "date" in clist[i]
        ) {
          clist[i]["holiday"] = (clist[i]["holiday"] == "1" || clist[i]["holiday"] == 1) ? 1 : 0;
          list.push(clist[i]);
        }
      }
      this.options.eventList = list;

    }
    addCustomEventList(this.options);
  }
  // ---------------
  // Private Methods
  function extendDefaults(source, properties) {
      var property;
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
  }
  function onChangeYear(ths,year){
    ths.options.selecItem.querySelectorAll("input.dc-yearInput")[0].value = year;
    ths.options.selecItem.querySelectorAll("label.dc-yearInput-label")[0].innerHTML = numberingOut( ths.options.firstCalendar.numbering , parseInt(year) ) ;
    resetingCalendar.call(ths);
    hideYearModal.call(ths);
    changeSideTitle.call(ths);
  }
  function onChangeMonth(ths,month){
    ths.options.selecItem.querySelectorAll("input.dc-monthInput")[0].value = month;
    ths.options.selecItem.querySelectorAll("label.dc-monthInput-label")[0].innerHTML = ths.options.firstCalendar.monthTitle[ parseInt(month)-1 ];
    resetingCalendar.call(ths);
    hideMonthModal.call(ths);
    changeSideTitle.call(ths);
  }
  function setCalendarDir(optn){
    if (optn.firstCalendar != null && optn.firstCalendar != undefined ) {
      if ( optn.firstCalendar.direction == null || optn.firstCalendar.direction == undefined ) {
        optn.firstCalendar.direction = optn.direction;
      }
    }
    if (optn.secondCalendar != null && optn.secondCalendar != undefined ) {
      if ( optn.secondCalendar.direction == null || optn.secondCalendar.direction == undefined ) {
        optn.secondCalendar.direction = optn.direction;
      }
    }
    if (optn.thirdCalendar != null && optn.thirdCalendar != undefined ) {
      if ( optn.thirdCalendar.direction == null || optn.thirdCalendar.direction == undefined ) {
        optn.thirdCalendar.direction = optn.direction;
      }
    }
    return optn;
  }
  function findIndex(sArray, vals ) {
      var index = 0;
      for (var i = 0; i < sArray.length; i++) {
        if (sArray[i] == vals) {
          index = i;
        }
      }
      return index;
  }
  function getConfMoment(optn){
    if (optn.momentConf == null) {
      return moment();
    }else{
      try {
        return optn.momentConf( moment() );
      } catch (e) {
        console.log("error config moment :"+e);
      }
    }
    // if (conf == null) {
    //   this.moment = moment();
    // }else{
    //   this.moment = moment();
    //   try {
    //     this.moment = conf(moment());
    //   } catch (e) {
    //     console.log("error config moment :"+e);
    //   }
    // }
  }
  function dayNameHeader(daylist , daytitle , width , start=0 ){
    var hederlist = [];
    for (var i = start; i < daylist.length; i++) {
      if (width == "sm") {
        hederlist.push( dayNameReplaceTitle( daytitle , daylist[i])[0]);
      }else{
        hederlist.push( dayNameReplaceTitle( daytitle , daylist[i]));
      }
    }
    for (var i = 0; i < start; i++) {
      if (width == "sm") {
        hederlist.push( dayNameReplaceTitle( daytitle , daylist[i])[0]);
      }else{
        hederlist.push( dayNameReplaceTitle( daytitle , daylist[i]));
      }
    }
    hederlist = aryTxtHtml( hederlist , `<th>` , `</th>` );
    return implodeArray(hederlist);
  }
  function dayNameReplaceTitle(daytitle,dayname){
    if ( dayname in daytitle ) {
      return daytitle[dayname];
    }
    return dayname
  }
  function aryTxtHtml( ary , firstpart , lastpart ){
    //
    for (var i = 0; i < ary.length; i++) {
      ary[i] = firstpart + ary[i];
      ary[i] = ary[i] + lastpart;
    }
    return ary;
  }
  function implodeArray( ary , separator = "" ){
    var out = "";
    for (var i = 0; i < ary.length; i++) {
      out += ary[i] ;
      if ( i < ary.length - 1 ) {
        out += separator;
      }
    }
    return out;
  }
  function tabelHeaderDay( optn ){
    var dayName = this.dayName;
    var findSI = findIndex( dayName , optn.startday );
    if (bodyWidth(optn) < getBreakingPoint(optn) ) {
      return dayNameHeader( dayName , optn.dayName , "sm" , findSI);
    }else{
      return dayNameHeader( dayName , optn.dayName , "lg" , findSI);
    }
  }
  function bodyWidth(optn){
    return optn.selecItem.clientWidth;
  }
  function getBreakingPoint(optn){
    return optn.breakingPoint;
  }
  function randomID(){
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
  }
  function setCurrentDate(){
    var mCurrentDate = getCurrentDate(this.options).split("-");
    var yeartitle =  numberingOut( this.options.firstCalendar.numbering , parseInt( mCurrentDate[0] ) );
    var monthtitle = this.options.firstCalendar.monthTitle[ parseInt( mCurrentDate[1] ) - 1 ];
    this.options.selecItem.querySelectorAll('input.dc-yearInput')[0].value = mCurrentDate[0];
    this.options.selecItem.querySelectorAll('label.dc-yearInput-label')[0].innerHTML =  yeartitle ;
    this.options.selecItem.querySelectorAll('input.dc-monthInput')[0].value = mCurrentDate[1];
    this.options.selecItem.querySelectorAll('label.dc-monthInput-label')[0].innerHTML =  monthtitle;
    this.options.selecItem.querySelectorAll(".dc--sidebarBaseCalTitle")[0].innerHTML = calendarSideInfoStyle(this.options , yeartitle , monthtitle);
    resetingCalendar.call(this);
  }
  function getCurrentDate(optn){
    var mm = getConfMoment(optn);
    var mCurrentDate = mm.format(optn.firstCalendar.momentType);
    if (optn.date != "" && optn.date.split("-").length == 3 ) {
      mCurrentDate = optn.date.split("-")[0] + "-";
      if (parseInt(optn.date.split("-")[1])<10) {
        mCurrentDate += "0"+ parseInt(optn.date.split("-")[1]);
      }else{
        mCurrentDate += parseInt(optn.date.split("-")[1]);
      }
      mCurrentDate += "-";
      if (parseInt(optn.date.split("-")[2])<10) {
        mCurrentDate += "0"+ parseInt(optn.date.split("-")[2]);
      }else{
        mCurrentDate += parseInt(optn.date.split("-")[2]);
      }
    }
    return mCurrentDate;
  }
  function getMonthTitle(optn){
    if (optn == null || optn.momentType == null || optn.momentType == "" ) {
      return [];
    }else if (optn.monthTitle != undefined && optn.monthTitle.length == 12) {
      return optn.monthTitle;
    }
    var monthFormat = optn.momentType.split("-")[1];
    if ( monthFormat.substring(monthFormat.length - 1 , monthFormat.length ) == "M" ) {
      monthFormat += monthFormat.substring(monthFormat.length - 1 , monthFormat.length );
      monthFormat += monthFormat.substring(monthFormat.length - 1 , monthFormat.length );
      var mm = getConfMoment(optn);
      var year = mm.format(optn.momentType).split("-");
      var monthTitle = [];
      for (var i = 0; i < 12; i++) {
        monthTitle.push(moment(year+"-"+(i+1)+"-01" ,optn.momentType).format(monthFormat));
      }
      return monthTitle;
    }
    return [];
  }
  function sortingDayInWeek(startday , daymode){
    var dayName = this.dayName;
    var findSI = findIndex( dayName , startday );
    var out = 0;
    if ( daymode - findSI >= 0 ) {
      out = daymode - findSI;
    }else{
      out = (7 - findSI ) + daymode;
    }
    return out;
  }
  function setFillTabel(){
    var month = this.options.selecItem.querySelectorAll('input.dc-monthInput')[0].value ;
    var year = this.options.selecItem.querySelectorAll('input.dc-yearInput')[0].value  ;
    this.options.selecItem.setAttribute("dc-month", month);
    var startDay = 1;
    var endDay = 31;
    var DITM = year+"-"+month+"-"; // Date in this month
    if ( moment( DITM+endDay , this.options.firstCalendar.momentType ).format("YYYY-MM-DD") == "Invalid date") {
      endDay = 30;
      if ( moment( DITM+endDay , this.options.firstCalendar.momentType ).format("YYYY-MM-DD") == "Invalid date") {
        endDay = 29;
        if ( moment( DITM+endDay , this.options.firstCalendar.momentType ).format("YYYY-MM-DD") == "Invalid date") {
          console.log("error : not find last day for "+endDay+" :( - Help Me !-!");
        }
      }
    }
    this.options.selecItem.querySelectorAll('tbody')[0].innerHTML = ``;
    var tbody = `<tr>`;
    var feldfill = 0;
    for (var i = 0; i < sortingDayInWeek( this.options.startday ,  moment( DITM+1 , this.options.firstCalendar.momentType ).day() ); i++) {
      tbody += `<td></td>`;
      feldfill += 1;
    }
    for (var i = 1; i <= endDay; i++) {
      tbody += `<td class="calendar-day animate-transition"
                    firstDate="${ convertDate( this.options.firstCalendar.momentType , this.options.firstCalendar.momentType , DITM+i ) }"
                    secondDate="${ convertDate( this.options.firstCalendar.momentType , this.options.secondCalendar.momentType , DITM+i ) }"
                    thirdDate="${ convertDate( this.options.firstCalendar.momentType , this.options.thirdCalendar.momentType , DITM+i ) }" >
                    ${ tabelCellStyle( this.options , DITM+i ) }
                </td>`;
      feldfill += 1;
      if ( feldfill%7 == 0) {
          tbody += `</tr><tr>`;
          feldfill = 0;
      }
    }
    for (var i = feldfill;  i%7 != 0; i++) {
        tbody += `<td></td>`;
    }
    tbody += `</tr>`;
    this.options.selecItem.querySelectorAll('tbody')[0].innerHTML = tbody;
    setweekendHoliday(this.options);
    addToday(this.options);
    selectdefaultTabelCell(this.options);
    sideBarOtherCalendarInfo(this.options,  convertDate( this.options.firstCalendar.momentType , this.options.firstCalendar.momentType , DITM+1 ) , convertDate( this.options.firstCalendar.momentType , this.options.firstCalendar.momentType , DITM+endDay ) );
    //-------------
    var startDayList = [];
    startDayList.push( year+"-"+month+"-"+startDay);
    startDayList.push(convertDate( this.options.firstCalendar.momentType , this.options.secondCalendar.momentType , year+"-"+month+"-"+startDay ));
    startDayList.push(convertDate( this.options.firstCalendar.momentType , this.options.thirdCalendar.momentType , year+"-"+month+"-"+startDay ));
    var endDayList = [];
    endDayList.push( year+"-"+month+"-"+endDay);
    endDayList.push(convertDate( this.options.firstCalendar.momentType , this.options.secondCalendar.momentType , year+"-"+month+"-"+endDay ));
    endDayList.push(convertDate( this.options.firstCalendar.momentType , this.options.thirdCalendar.momentType , year+"-"+month+"-"+endDay ));

    this.startDay = startDayList;
    this.endDay   = endDayList;

    //-------------
    return true;
  }
  function runOnChange(startDay,endDay){
    if (this.options.onChange != null && {}.toString.call(this.options.onChange) === '[object Function]' ) {
      this.options.onChange(startDay,endDay);
    }
  }
  function convertDate( of = "YYYY-MM-DD" , to , date ){
    if (to == "" || to == undefined ) {
      return "";
    }
    return out = moment( date , of ).format(to);
  }
  function numberingOut( numbering , num ){
    if (numbering == null || numbering == "" || numbering == undefined) {
      return parseInt(num);
    }else{
      num = parseInt(num);
      return numbering(num);
    }
  }
  function tabelCellStyle( optn , date ){
    var td = ``;
    if (optn.firstCalendar.momentType != "" && optn.firstCalendar.momentType != undefined ) {
      var dayN = convertDate( optn.firstCalendar.momentType , optn.firstCalendar.momentType.split("-")[2] , date );
      td += `<span class="firstCalendar base-form animate-transition">${ numberingOut( optn.firstCalendar.numbering , dayN ) }</span>
             <span class="firstCalendar second-form animate-transition">${ numberingOut( optn.firstCalendar.numbering , dayN ) }</span>`;
    }
    if (optn.secondCalendar.momentType != "" && optn.secondCalendar.momentType != undefined ) {
      var dayN = convertDate( optn.firstCalendar.momentType , optn.secondCalendar.momentType.split("-")[2] , date );
      td += `<span class="secondCalendar">${ numberingOut( optn.secondCalendar.numbering , dayN ) }</span>`;
    }
    if (optn.thirdCalendar.momentType != "" && optn.thirdCalendar.momentType != undefined ) {
      var dayN = convertDate( optn.firstCalendar.momentType , optn.thirdCalendar.momentType.split("-")[2] , date );
      td += `<span class="thirdCalendar">${ numberingOut( optn.thirdCalendar.numbering , dayN ) }</span>`;
    }
    return td;
  }
  function setweekendHoliday(optn){
    var index = 7;
    for (var i = 0; i < optn.weekendHoliday.split(",").length; i++) {
      index = findIndexInTabel( optn.startday  , optn.weekendHoliday.split(",")[i] ) ;
      optn.selecItem.querySelector('table.calendarTabel').querySelectorAll('tbody tr>td:nth-child('+(index+1)+')').forEach( function(item, indx){
        if ( (" " + item.className + " ").replace(/[\n\t]/g, " ").indexOf(" calendar-day ") > -1 ) {
          item.classList.add("holiday");
        }
      });
    }
  }
  function findIndexInTabel( sday , hday ){
    var dayName = this.dayName;
    var findSI = findIndex( dayName , sday );
    var sortDay = [];
    for (var i = findSI; i < dayName.length; i++) {
      sortDay.push(dayName[i]);
    }
    for (var i = 0; i < findSI; i++) {
      sortDay.push(dayName[i]);
    }
    return findIndex(sortDay, hday);
  }
  function resetingCalendar(){
    if( setFillTabel.call(this) ){
      setHolidayEvent.call(this);
      this.options.eventList = [];
      runOnChange.call(this,this.startDay,this.endDay);
    }
  }
  function changeSideTitle() {
    var yeartitle = numberingOut( this.options.firstCalendar.numbering , parseInt(this.options.selecItem.querySelectorAll("input.dc-yearInput")[0].value) );
    var monthtitle = this.options.firstCalendar.monthTitle[ parseInt(this.options.selecItem.querySelectorAll("input.dc-monthInput")[0].value)-1 ];
    this.options.selecItem.querySelectorAll(".dc--sidebarBaseCalTitle")[0].innerHTML = calendarSideInfoStyle(this.options , yeartitle , monthtitle);
  }
  function setHolidayEvent(){
    if (this.options.endLoading) {
      var tds = this.options.selecItem.querySelector('table.calendarTabel').querySelectorAll('tbody tr>td.calendar-day');
      var event1 = this.options.firstCalendar.eventDay;
      var event2 = this.options.secondCalendar.eventDay;
      var event3 = this.options.thirdCalendar.eventDay;
      for (var i = 0; i < tds.length; i++) {
          if ( hasHolidayEvent( tds[i].getAttribute("firstdate") , event1 ) ) {
            addHolidayToCell(tds[i]);
          }
          if ( hasHolidayEvent( tds[i].getAttribute("seconddate") , event2 ) ) {
            addHolidayToCell(tds[i]);
          }
          if ( hasHolidayEvent( tds[i].getAttribute("thirddate") , event3 ) ) {
            addHolidayToCell(tds[i]);
          }
      }
    }else{
      console.log("not loading");
    }
  }
  function yearFilling(optn , centerVal ){
    yy = [];
    for (var i = centerVal - 7; i <= centerVal + 7; i++) {
      yy.push(i);
    }
    var tsYear = optn.selecItem.querySelectorAll("input.dc-yearInput")[0].value;
    optn.selecItem.querySelectorAll(".dc--yearModalContent")[0].innerHTML = `${ yy.map( text => `<span class="year-item ${ (text == tsYear) ? `this-year` : `` }" year-index="${ text }">${ numberingOut( optn.firstCalendar.numbering , text ) }</span>`  ).join(``) }`
  }
  function getEventJSON(calendarNum , callback = null){
    if (this.options[calendarNum].eventSrc == "" || this.options[calendarNum].eventSrc == undefined) {
       this.options[calendarNum].eventDay = [];
       callback();
    }else{
      var ths = this;
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.options[calendarNum].eventSrc, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status == 200) {
            ths.options[calendarNum].eventDay = xhr.response;
          } else {
            ths.optionsn[calendarNum].eventDay = [];
          }
          callback();
        };
        xhr.send();
      } catch (e) {
        console.log(e);
        ths.options[calendarNum].eventDay = [];
        callback();
      }
    }
  }
  function calendarMonthTitle(){
    this.options.firstCalendar.monthTitle  = getMonthTitle(this.options.firstCalendar);
    this.options.secondCalendar.monthTitle = getMonthTitle(this.options.secondCalendar);
    this.options.thirdCalendar.monthTitle  = getMonthTitle(this.options.thirdCalendar);
  }
  function calendarEventList(){
    var ths = this;
    getEventJSON.call(ths , "firstCalendar" , function(){
      getEventJSON.call(ths , "secondCalendar" , function(){
        getEventJSON.call(ths , "thirdCalendar" , function(){
          ths.options.endLoading = true;
        } );
      });
    });

  }
  function hasHolidayEvent(date, list = null){
    if (list == null || list == undefined || list == [] || list == "" || date == null || date == undefined || date == [] || date == "") {
      return false;
    }else{
      var mnt = parseInt(date.split("-")[1])+"";
      var day = parseInt(date.split("-")[2])+"";

      if ( list[mnt][day] == undefined ) {
        return false;
      }else{
        var hasholiday = false;
        for (var i = 0; i < list[mnt][day].length; i++) {
          if (list[mnt][day][i].holiday == "1") {
            hasholiday = true;
          }
        }
        return hasholiday;
      }
    }
    return false;
  }
  function addHolidayToCell(item){
    if ( (" " + item.className + " ").replace(/[\n\t]/g, " ").indexOf(" holiday ") == -1 ) {
      item.classList.add("holiday");
    }
  }
  function addToday(optn){
    var today = getCurrentDate(optn);
    optn.selecItem.querySelectorAll('tbody td[firstDate="'+today+'"]').forEach(function(item, indx){
        item.classList.add("today");
    });
  }
  function selectdefaultTabelCell(optn){
    if ( optn.selecItem.querySelectorAll('td[firstdate="'+getCurrentDate(optn)+'"]').length == 1  ) {
        selectTD(optn, optn.selecItem.querySelectorAll('td.calendar-day[firstdate="'+getCurrentDate(optn)+'"]')[0] );
    }else{
        selectTD(optn, optn.selecItem.querySelectorAll('td.calendar-day')[0] );
    }
  }
  function sideBarOtherCalendarInfo(optn , sday , eday){
    var hml='';
    if (optn.secondCalendar.momentType != null &&
        optn.secondCalendar.momentType != undefined &&
        optn.secondCalendar.momentType != "" ) {
          hml += calendarSideInfoStyle(optn ,
            CalendarYearRangTitle(optn , "secondCalendar" , sday , eday) ,
            CalendarMonthRangTitle(optn , "secondCalendar" , sday , eday)
          );
    }
    if (optn.thirdCalendar.momentType != null &&
        optn.thirdCalendar.momentType != undefined &&
        optn.thirdCalendar.momentType != "" ) {
          hml += calendarSideInfoStyle(optn ,
            CalendarYearRangTitle(optn , "thirdCalendar" , sday , eday) ,
            CalendarMonthRangTitle(optn , "thirdCalendar" , sday , eday)
          );
    }
    optn.selecItem.querySelectorAll('.dc--sidebarMonthRage')[0].innerHTML = hml;
  }
  function CalendarMonthRangTitle(optn , calendarSt, sday , eday){
    var m1 = parseInt( convertDate( optn.firstCalendar.momentType , optn[calendarSt].momentType , sday ).split("-")[1] )-1;
    var m2 = parseInt( convertDate( optn.firstCalendar.momentType , optn[calendarSt].momentType , eday ).split("-")[1] )-1;
    var months = "";
    if (m1 == m2) {
      month =  optn[calendarSt].monthTitle[m1];
    }else{
      month =  optn[calendarSt].monthTitle[m1] + " - " + optn[calendarSt].monthTitle[m2];
    }
    return month;
  }
  function CalendarYearRangTitle(optn , calendarSt, sday , eday){
    var y1 = convertDate( optn.firstCalendar.momentType , optn[calendarSt].momentType , sday ).split("-")[0];
    var y2 = convertDate( optn.firstCalendar.momentType , optn[calendarSt].momentType , eday ).split("-")[0];
    var year = "";
    if (y1 == y2) {
      year = numberingOut( optn[calendarSt].numbering , y1 );
    }else{
      year = numberingOut( optn[calendarSt].numbering , y1 ) + " - " + numberingOut( optn[calendarSt].numbering , y2 );
    }
    return year;
  }
  function calendarSideInfoStyle(optn,year, month){
    return `
      <div class="calendarInfo-title">
        <span class="calendarInfo-year">${ year }</span>
        <span class="calendarInfo-month">${ month }</span>
      </div>`;
  }
  function selectTD(optn, td ){
    var lastvalue = 0;
    optn.selecItem.querySelectorAll("td.calendar-day.selected").forEach(
      function(item, indx){
          item.classList.remove("selected");
      }
    );
    td.classList.add("selected");
    changeSideBarNumberDay( optn , td.getAttribute("firstdate").split("-")[2] );
    optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDayTitle")[0].innerHTML = getDayTitleName(optn , td );
    if (optn.secondCalendar != null && optn.secondCalendar.momentType != null && optn.secondCalendar.momentType != "" ) {
      var date =  numberingOut( optn.secondCalendar.numbering , parseInt(td.getAttribute("seconddate").split("-")[2]) ) ;
      date += "&nbsp;&nbsp;";
      date +=  optn.secondCalendar.monthTitle[ parseInt(td.getAttribute("seconddate").split("-")[1])-1 ];
      date += "&nbsp;&nbsp;";
      date += numberingOut( optn.secondCalendar.numbering ,td.getAttribute("seconddate").split("-")[0]);
      optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDay.secondCalendar>.calendarDate")[0].innerHTML = date;
      optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDay.secondCalendar>.calendarDate")[0].style.direction = optn.secondCalendar.direction;

    }
    if (optn.thirdCalendar != null && optn.thirdCalendar.momentType != null && optn.thirdCalendar.momentType != "" ) {
      var date =  numberingOut( optn.thirdCalendar.numbering ,td.getAttribute("thirddate").split("-")[2]);
      date += "&nbsp;&nbsp;";
      date +=  optn.thirdCalendar.monthTitle[ parseInt(td.getAttribute("thirddate").split("-")[1])-1 ];
      date += "&nbsp;&nbsp;";
      date += numberingOut( optn.thirdCalendar.numbering ,td.getAttribute("thirddate").split("-")[0]);
      optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDay.thirdCalendar>.calendarDate")[0].innerHTML = date;
      optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDay.thirdCalendar>.calendarDate")[0].style.direction = optn.thirdCalendar.direction;
    }
    setDayEvent( optn , td );
  }
  function setDayEvent(optn , td ) {
    var holiday = [];
    var evntList = [];
    var firstDate  = td.getAttribute("firstdate");
    var firstDateM  = parseInt(firstDate.split("-")[1]);
    var firstDateD  = parseInt(firstDate.split("-")[2]);
    var secondDate = td.getAttribute("seconddate");
    var secondDateM =  parseInt(secondDate.split("-")[1]);
    var secondDateD =  parseInt(secondDate.split("-")[2]);
    var eventhml = ``;
    var thirdDate  = td.getAttribute("thirddate");
    var thirdDateM =  parseInt(thirdDate.split("-")[1]);
    var thirdDateD =  parseInt(thirdDate.split("-")[2]);
    if (hasEventForDay(optn,"firstCalendar",firstDateM,firstDateD)) {
      for (var i = 0; i < optn.firstCalendar.eventDay[firstDateM][firstDateD].length; i++) {
        if (optn.firstCalendar.eventDay[firstDateM][firstDateD][i][ "holiday"] == "1") {
          holiday.push(optn.firstCalendar.eventDay[firstDateM][firstDateD][i]);
        }else{
          evntList.push(optn.firstCalendar.eventDay[firstDateM][firstDateD][i]);
        }
      }
    }
    if (hasEventForDay(optn,"secondCalendar",secondDateM,secondDateD)) {
      for (var i = 0; i < optn.secondCalendar.eventDay[secondDateM][secondDateD].length; i++) {
        if (optn.secondCalendar.eventDay[secondDateM][secondDateD][i][ "holiday"] == "1") {
          holiday.push(optn.secondCalendar.eventDay[secondDateM][secondDateD][i]);
        }else{
          evntList.push(optn.secondCalendar.eventDay[secondDateM][secondDateD][i]);
        }
      }
    }
    if (hasEventForDay(optn,"thirdCalendar",thirdDateM,thirdDateD)) {
      for (var i = 0; i < optn.thirdCalendar.eventDay[thirdDateM][thirdDateD].length; i++) {
        if (optn.thirdCalendar.eventDay[thirdDateM][thirdDateD][i][ "holiday"] == "1") {
          holiday.push(optn.thirdCalendar.eventDay[thirdDateM][thirdDateD][i]);
        }else{
          evntList.push(optn.thirdCalendar.eventDay[thirdDateM][thirdDateD][i]);
        }
      }
    }

    var txt = "";
    for (var i = 0; i < optn.eventList.length; i++) {
      if (
        ( optn.eventList[i]["type"] == "firstCalendar" && optn.eventList[i]["date"] == firstDate ) ||
        ( optn.eventList[i]["type"] == "secondCalendar" && optn.eventList[i]["date"] == secondDate ) ||
        ( optn.eventList[i]["type"] == "thirdCalendar" && optn.eventList[i]["date"] == thirdDate )
      ) {
        if (optn.eventList[i]["holiday"] == 1) {
          holiday.push(optn.eventList[i]);
        }else{
          evntList.push(optn.eventList[i]);
        }
      }
    }

    for (var i = 0; i < holiday.length; i++) {
      eventhml += `<li class="holiday"><b>${ holiday[i].title }</b> (${optn.defaultLag.holiday}) </li>` ;
    }
    for (var i = 0; i < evntList.length; i++) {
      eventhml += `<li>${ evntList[i].title }</li>`;
    }
    optn.selecItem.querySelectorAll(".dc--calendarFooter>ul")[0].innerHTML = eventhml;
  }
  function changeSideBarNumberDay(optn , val){
    optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDayNum")[0].innerHTML = numberingOut( optn.firstCalendar.numbering , val );
    // clearInterval(this.dayInterval);
    // this.dayCounter = optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDayNum")[0].getAttribute("counterNumber");
    // this.dayInterval = setInterval(function(){
    //   optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDayNum")[0].innerHTML =  numberingOut( optn.firstCalendar.numbering , this.dayCounter );
    //   optn.selecItem.querySelectorAll(".dc--sidebarBaseCalDayNum")[0].setAttribute("counterNumber",this.dayCounter);
    //   if (val == this.dayCounter) {
    //     clearInterval(this.dayInterval);
    //   }else if (val > this.dayCounter) {
    //     this.dayCounter++;
    //   }else{
    //     this.dayCounter--;
    //   }
    // },50);
  }
  function getDayTitleName(optn , td ){
    var dayName = this.dayName;
    var findSI = findIndex( dayName , optn.startday );
    var idx = [].slice.call(td.parentNode.children).indexOf(td);
    var hederlist = [];
    for (var i = findSI; i < dayName.length; i++) {
      hederlist.push( dayNameReplaceTitle( optn.dayName , dayName[i]));
    }
    for (var i = 0; i < findSI; i++) {
      hederlist.push( dayNameReplaceTitle( optn.dayName , dayName[i]));
    }
    return hederlist[idx];
  }
  function hasEventForDay(optn , calendar , month , day){
    if (optn[calendar] != null &&  optn[calendar] != undefined ) {
      if (optn[calendar].eventDay != undefined && optn[calendar].eventDay != null) {
        if ( parseInt(month) in optn[calendar].eventDay ) {
          if ( parseInt(day) in optn[calendar].eventDay[parseInt(month)] ) {
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  function resizeWindow(optn) {
    optn.selecItem.querySelectorAll(".calendarTabel>thead>tr")[0].innerHTML = tabelHeaderDay( optn);
    sidebarToggleIconChange(optn);
  }
  function creatHtmlStructer( optn ){
    return `
      ${ createBody(optn) }
      ${ createYearModal(optn) }
      ${ createMonthModal(optn) }
    `;
  }
  function createYearModal(optn){
      return `
        <div class="dc--yearModal dc--Modal">
          <div class="dc--ModalBody">
            <button class="dc--close">${ optn.defaultIcon.close }</button>
            <div class="dc--ModalContent">
              <div class="dc--yearModalContent">
              </div>
              <button class="dc--nextPageYear">${ optn.defaultIcon.rightArrow }</button>
              <button class="dc--previwPageYear">${ optn.defaultIcon.leftArrow }</button>
            </div>
          </div>
        </div>`;
    }
  function createMonthModal(optn){
      return `
      <div class="dc--monthModal dc--Modal">
        <div class="dc--ModalBody">
          <button class="dc--close">${ optn.defaultIcon.close }</button>
          <div class="dc--ModalContent">
            ${ optn.firstCalendar.monthTitle.map( (text, index) => `<span class="month-item" month-index="${ index+1 }">${ text }</span>` ).join(``) }
          </div>
        </div>
      </div>`;
    }
  function createSideBar(optn){
    var cal2st = ``;
    var cal3st = ``;
    if (optn.secondCalendar != null && optn.secondCalendar.momentType != null && optn.secondCalendar.momentType != "" ) {
      cal2st = `
      <div class="dc--sidebarBaseCalDay secondCalendar">
        <div class="calendarTitle">
          ${ (optn.secondCalendar.title != null && optn.secondCalendar.title != undefined) ? optn.secondCalendar.title : "" }
        </div>
        <div class="calendarDate">
        </div>
      </div>`;
    }

    if (optn.thirdCalendar != null && optn.thirdCalendar.momentType != null && optn.thirdCalendar.momentType != "" ) {
      cal3st = `
        <div class="dc--sidebarBaseCalDay thirdCalendar">
          <div class="calendarTitle">
            ${ (optn.thirdCalendar.title != null && optn.thirdCalendar.title != undefined) ? optn.thirdCalendar.title : "" }
          </div>
          <div class="calendarDate">
          </div>
        </div>`;
    }
    return `
      <div class="dc--sidebarMonthRage">
      </div>
      <div class="dc--sidebarBaseCalTitle"></div>
      <div class="dc--sidebarBaseCalDayNum"></div>
      <div class="dc--sidebarBaseCalDayTitle"></div>
      ${ cal2st }
      ${ cal3st }
    `;
  }
  function getThemeClass(optn){
    var selThem = optn.theme;
    selThem = "dcTheme--"+selThem;
    return selThem;
  }
  function getColoringClass(optn){
    return "dcColoring--"+optn.coloring;
  }
  function removeColorClass(optn){
    optn.selecItem.classList.remove( getColoringClass(optn) );
  }
  function removeThemeClass(optn){
    optn.selecItem.classList.remove( getThemeClass(optn) );
  }
  function addThemeClass(optn){
    optn.selecItem.classList.add( getThemeClass(optn) );
  }
  function addColorClass(optn){
    optn.selecItem.classList.add( getColoringClass(optn) );
  }
  function createBody(optn){
      const yearId = randomID();
      const monthId = randomID();
      return `
      <div class="dc--body animate-transition">
        ${ (optn.direction  != "rtl") ? `<div class="dc--sidebar dc--showBar animate-transition">${ createSideBar(optn) }</div>` : `` }
        <div class="dc--mainbar animate-transition">
          <button class="dc--toggleSidebar animate-transition">${ optn.defaultIcon.rightArrow }</button>
          <div class="dc--calendarHeader">
            <label class="dc-yearInput-label animate-transition" for="${ yearId }"></label>
            <input class="dc-yearInput" id="${ yearId }" />
            <label class="dc-monthInput-label animate-transition" for="${ monthId }"></label>
            <input class="dc-monthInput" id="${ monthId }" />
            <h5 class="dc-calendarTitle">${ optn.firstCalendar.title }</h5>
          </div>
          <table class="calendarTabel">
            <thead>
              <tr>
                ${ tabelHeaderDay( optn) }
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
          <div class="dc--calendarFooter">
              <h5 class="calendarEventTitle" >${ optn.defaultLag.events }:</h5>
              <ul class="calendarEventList">
              </ul>
          </div>
        </div>
        ${ (optn.direction  == "rtl") ? `<div class="dc--sidebar dc--showBar animate-transition">${ createSideBar(optn) }</div>` : `` }
      </div>

      `;
    }
  function delegate(el, evt, sel, handler) {
    el.addEventListener(evt, function(event) {
        var t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode;
        }
    });
  }
  function showYearModal(){
    var vals =  this.options.selecItem.querySelectorAll("input.dc-yearInput")[0].value;
    vals = ( parseInt(vals) > 0 ) ? parseInt(vals) : 0 ;
    yearFilling(this.options , vals );
    this.options.selecItem.querySelectorAll(".dc--yearModal")[0].classList.add("dc--show");
    this.options.selecItem.querySelectorAll(".dc--body")[0].classList.add("filltering");
  }
  function showMonthModal(){
    this.options.selecItem.querySelectorAll(".dc--monthModal")[0].classList.add("dc--show");
    this.options.selecItem.querySelectorAll(".dc--body")[0].classList.add("filltering");
  }
  function hideMonthModal(){
    this.options.selecItem.querySelectorAll(".dc--monthModal")[0].classList.remove("dc--show");
    this.options.selecItem.querySelectorAll(".dc--body")[0].classList.remove("filltering");
  }
  function hideYearModal(){
    this.options.selecItem.querySelectorAll(".dc--yearModal")[0].classList.remove("dc--show");
    this.options.selecItem.querySelectorAll(".dc--body")[0].classList.remove("filltering");
  }
  function hiddenModal(ts , sel){
    ts.parentElement.parentElement.classList.remove("dc--show");
    sel.querySelectorAll(".dc--body")[0].classList.remove("filltering");
  }
  function toggleSidebar(optn ){
    var sel = optn.selecItem;
    var item = sel.querySelectorAll(".dc--sidebar")[0];
    if( (" " + item.className + " ").replace(/[\n\t]/g, " ").indexOf(" dc--showBar ") == -1  ){
        item.classList.add("dc--showBar");
    }else{
      item.classList.remove("dc--showBar");
    }
    sidebarToggleIconChange(optn);
  }
  function sidebarToggleIconChange(optn){
    var sel = optn.selecItem;
    var item = sel.querySelectorAll(".dc--sidebar")[0];
    if( (" " + item.className + " ").replace(/[\n\t]/g, " ").indexOf(" dc--showBar ") == -1  ){
      if (bodyWidth(optn) < getBreakingPoint(optn) ) {
        sel.querySelectorAll(".dc--toggleSidebar")[0].innerHTML  = optn.defaultIcon.menu;
      }else{
        sel.querySelectorAll(".dc--toggleSidebar")[0].innerHTML  = optn.defaultIcon.leftArrow;
      }
    }else{
      if (bodyWidth(optn) < getBreakingPoint(optn) ) {
        sel.querySelectorAll(".dc--toggleSidebar")[0].innerHTML  = optn.defaultIcon.close;
      }else{
        sel.querySelectorAll(".dc--toggleSidebar")[0].innerHTML  = optn.defaultIcon.rightArrow;
      }
    }
  }
  function addCustomEventList(optn){
      var sel = optn.selecItem;
      var list = optn.eventList;
      var query = '';
      for (var i = 0; i < list.length; i++) {
        if (list[i]["holiday"] == 1) {
          query = 'tbody td[';
          if (list[i]["type"] == "firstCalendar") {
            query += 'firstdate="'+list[i]["date"]+'"';
          }else if ( list[i]["type"] == "secondCalendar" ) {
            query += 'seconddate="'+list[i]["date"]+'"';
          }else if (list[i]["type"] == "thirdCalendar") {
            query += 'thirddate="'+list[i]["date"]+'"';
          }
          query += ']';
          if (  sel.querySelectorAll(query).length >= 0 ) {
            sel.querySelectorAll(query).forEach( function(item, indx){
              if ( (" " + item.className + " ").replace(/[\n\t]/g, " ").indexOf(" holiday ") == -1 ) {
                item.classList.add("holiday");
              }
            });
          }
        }
      }
      selectTD(optn,sel.querySelectorAll("tbody td.selected")[0]);

  }


}());
