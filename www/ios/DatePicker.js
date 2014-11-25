/**
  Phonegap DatePicker Plugin
  https://github.com/sectore/phonegap3-ios-datepicker-plugin
  
  Copyright (c) Greg Allen 2011
  Additional refactoring by Sam de Freyssinet
  
  Rewrite by Jens Krause (www.websector.de)

  MIT Licensed
*/

var exec = require('cordova/exec');

//Use custom logger if available
var _log = window['_log'] || console;

/**
 * Constructor
 */
function DatePicker() {
    this._callback;
}

/**
 * show - true to show the ad, false to hide the ad
 */
DatePicker.prototype.show = function(_options, cb) {
    var me = "DatePicker::show";

    _options = _options || {};

    //clone (shallow copy) the options to not change the input _options hash object values
    var options = {};
    for (var prop in _options) {
        options[prop] = _options[prop];
    }

    var padDate = function(date) {
      if (date.length == 1) {
        return ("0" + date);
      }

      return date;
    };

    var formatDate = function(date) {
      date = date.getFullYear() 
            + "-" 
            + padDate(date.getMonth()+1) 
            + "-" 
            + padDate(date.getDate()) 
            + "T" 
            + padDate(date.getHours()) 
            + ":" 
            + padDate(date.getMinutes()) 
            + ":00Z";

      return date
    };

    if (DatePicker.isDate(options.date)) {
        options.date = formatDate(options.date);
    } else if (options.date) {
        _log.warn(me + " : Given date is not a Date instance or an invalid date, using default instead ...");
    }

    if (DatePicker.isDate(options.minDate)) {
        options.minDate = formatDate(options.minDate);
    } else if (options.minDate) {
        _log.warn(me + " : Given minDate is not a Date instance or an invalid date, using default instead ...");
    }

    if (DatePicker.isDate(options.maxDate)) {
        options.maxDate = formatDate(options.maxDate);
    } else if (options.maxDate) {
        _log.warn(me + " : Given maxDate is not a Date instance or an invalid date, using default instead ...");
    }

    var defaults = {
        mode: 'date',
        date: new Date(),
        allowOldDates: true,
        allowFutureDates: true,
        minDate: '',
        maxDate: '',
        doneButtonLabel: 'Done',
        doneButtonColor: '#0000FF',
        cancelButtonLabel: 'Cancel',
        cancelButtonColor: '#000000',
        clearButtonLabel: 'Clear',
        clearButtonColor: '#FF0000',
        clearButton: false,
        x: '0',
        y: '0',
        minuteInterval : 5
    };

    for (var key in defaults) {
        if ((typeof options[key] !== "undefined") && (options[key] !== null))
            defaults[key] = options[key];
    }
    this._callback = cb;

    exec(null, 
      null, 
      "DatePicker", 
      "show",
      [defaults]
    );
};

DatePicker.prototype._dateSelected = function(date) {
    var d;
    if(date === "cancel" || date === "clear") {
        d = date;
    } else {
        d = new Date(parseFloat(date) * 1000);
    }
    if (this._callback)
        this._callback(d);
};

//Static
DatePicker.isDate = function(d) {
    if (!(d instanceof Date)) {
        return false;
    }

    return !(isNaN(d.getTime()));
};

var datePicker = new DatePicker();
module.exports = datePicker;

// Make plugin work under window.plugins
if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.datePicker) {
    window.plugins.datePicker = datePicker;
}