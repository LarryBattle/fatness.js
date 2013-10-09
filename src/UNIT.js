/**
* 
*/
var UNIT = (function () {
	"use strict";
	var UNIT = {
		WEIGHT_PRECISION : 2,
		METERS_PER_INCH : 0.02539,
		KG_PER_POUND : 0.453592,
		POUND_PER_KG : 2.204624,
		INCHES_PER_FOOT : 12
	};
	/**
	* Returns the metric value given feet and inches.
	* @param {Number} - feet
	* @param {Number} - inches
	* @return {Number} - metric value
	*/
	UNIT.convertStandardHeightToMetric = function (feet, inches) {
		return ((feet * UNIT.INCHES_PER_FOOT) + inches) * UNIT.METERS_PER_INCH;
	};
	/**
	* Converts Pounds to KiloGram.
	* @param {Number} lbs - pounds
	* @returns {Number} kilograms
	*/
	UNIT.convertPoundsToKG = function (lbs) {
		return Number( ( lbs * UNIT.KG_PER_POUND ).toFixed( UNIT.WEIGHT_PRECISION ));
	};
	/**
	* Converts KiloGram to Pounds.
	* @param {Number} kilograms
	* @returns {Number} lbs - pounds
	*/
	UNIT.convertKGToPounds = function (kg) {
		return Number( ( kg * UNIT.POUND_PER_KG ).toFixed( UNIT.WEIGHT_PRECISION ));
	};
	/**
	* Parse a string using the standard (English) height and returns the metric value.
	* @param {String} str - "##ft ##in" format expected
	* @returns {Number}
	*/
	UNIT.parseStandardHeightToMetric = function (str) {
		var x = parseFloat(str);
		var arr = UNIT.parseStandardHeightToArray(str);
		return (/kg/i).test(str) ? x : UNIT.convertStandardHeightToMetric(arr[0], arr[1]);
	};
	/**
	* Parse a string in the format "##ft ##in" into an array of `[ feet value, inch value]`
	* @param {String} str - "##ft ##in" format expected
	* @returns {Array<Number>}
	*/
	UNIT.parseStandardHeightToArray = function (str) {
		str = ""+str;
		var RE_looksLike_NumberThenFt = /((\d+\.)?\d+)(\s+)?((f(ee|oo)?ts?)|'([^']|\b))/g,
			RE_looksLike_NumberThenIn = /((\d+\.)?\d+)(\s+)?((in(che?)?s?)|'')/g,
			ft = parseFloat(str.match(RE_looksLike_NumberThenFt)||0),
			inches = parseFloat(str.match( RE_looksLike_NumberThenIn )||0);
		
		return [ft, inches];
	};
	/**
	* Parses a string using pounds to the metric value.
	* @param {String} - expects the format "##lbs"
	* @return {Number}
	*/
	UNIT.parseStandardWeightToMetric = function (str) {
		var x = parseFloat(str);
		return (/m/i).test(str) ? x : UNIT.convertPoundsToKG(x);
	};
	/**
	* Parse a string and returns the gender.
	* Choose "female" if the string contains `f`, `w`, or `gi`, corresponding to "female", "woman", "girl".
	* Otherwise default to "male".
	* @return {String} - gender "male" or "female"
	*/
	UNIT.parseGender = function(str){
		return (/[fw]|gi/i).test(str) ? "female" : "male";
	};
	return UNIT;
}());
