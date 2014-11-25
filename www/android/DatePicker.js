/**
 * Phonegap DatePicker Plugin Copyright (c) Greg Allen 2011 MIT Licensed
 * Reused and ported to Android plugin by Daniel van 't Oever
 *
 * Updated by Freddy Snijder, Calendar42 Team
 *
 */

//Use custom logger if available
var _log = window['_log'] || console;

/**
 * Constructor
 */
function DatePicker() {
  //this._callback;
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

	if (DatePicker.isDate(options.date)) {
		options.date = options.date.getTime();
	} else if (options.date) {
		_log.warn(me + " : Given date is not a Date instance or an invalid date, using default instead ...");
	}

	var defaults = {
		mode 				: 'date',
		date 				: '',
		minDate				: 0,
		maxDate				: 0,
		doneButtonLabel		: "Done",
		cancelButtonLabel	: "Cancel",
		clearButtonLabel	: "Clear",
		clearButton			: false,
		minuteInterval 		: 5
	};

	for (var key in defaults) {
		if ((typeof options[key] !== "undefined") && (options[key] !== null)) {
			defaults[key] = options[key];
		}
	}

	//this._callback = cb;

	var callback = function(message) {
		if ( message == "clear" || message == "cancel" ) {
			cb(message);
		} else {
			cb(new Date(parseInt(message, 10)));
		}
	};
  
	cordova.exec(callback, 
		null, 
		"DatePickerPlugin", 
		defaults.mode,
		[defaults]
	);
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