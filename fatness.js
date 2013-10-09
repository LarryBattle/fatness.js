/**
* This script provides objects to help calculate the BMI and BAI for a person.
* @author Larry Battle
* @license MIT
* @version 0.3
* @creationDate Nov 23, 2012
*/
// Body Adiposity Index Classifications for Women
// Age(years)Underweight Healthy Overweight Obese
// 20 - 39 Less than 21 % 21 % to 33 % Greater than 33 % Greater than 39 %
// 40 - 59 Less than 23 % 23 % to 35 % Greater than 35 % Greater than 41 %
// 60 - 79 Less than 25 % 25 % to 38 % Greater than 38 % Greater than 43 %
// Body Adiposity Index Classifications for Men
// Age(years)Underweight Healthy Overweight Obese
// 20 - 39 Less than 8 % 8 % to 21 % Greater than 21 % Greater than 26 %
// 40 - 59 Less than 11 % 11 % to 23 % Greater than 23 % Greater than 29 %
// 60 - 79 Less than 13 % 13 % to 25 % Greater than 25 % Greater than 31 %
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
/**
 * BMI.js
 * @purpose Provides a class to help calculate the Body mass Index. <br/>
 * Supports both metric and standard units.
 * @date Nov 28, 2012
 * @version 0.1
 * @author Larry Battle <http://bateru.com/news>
 *
 */
var BMI = (function () {
	"use strict";
	var BMI = function (o) {
		if (!o || typeof o !== "object") {
			throw new Error("BMI constructor requires for an object to be passed.");
		}
		if (!(this instanceof BMI)) {
			return new BMI(o);
		}
		this.height = o.height;
		this.weight = o.weight;
		this.isMetric = !o.isStandard;
		this.gender = UNIT.parseGender(o.gender);
		this.normalizeInput();
		return this;
	};
	/**
	* Calculates the weight difference between two BMI values.
	* Compares BMIB - BMIA.
	* Must be in the metric unit.
	* @param {Number} BMIA - BMI value
	* @param {Number} BMIB - BMI value
	* @param {Number} height - metric in KG
	* @param {Number} weight in KG 
	*/
	BMI.getWeightDifferenceBetweenTwoBMIS = function(height, BMIA, BMIB){
		return Number((Math.pow(height, 2) * (BMIB - BMIA) ).toFixed(UNIT.WEIGHT_PRECISION));
	};
	/**
	* Calculates the weight difference between two BMI values but finds the range.
	* Compares BMIB - BMIA.
	* Must be in the metric unit.
	* @param {String} gender - male or female
	* @param {Number} height - metric in KG
	* @param {Number} BMIA - BMI value
	* @param {Number} BMIForTargetRange - BMI value (This is be converted to a range)
	* @param {Number} weight in KG 
	*/
	BMI.getWeightDifferenceBetweenBMIRange = function(gender, height, BMIA, BMIForTargetRange ){
		var bmiARangeName = BMI.getBMIInRangeOfStatus( gender, BMIA )[0],
			arr = BMI.getBMIInRangeOfStatus( gender, BMIForTargetRange );
		
		if(typeof bmiARangeName === "undefined" || typeof arr[0] === "undefined" || (bmiARangeName === arr[0])){
			return 0;
		}
		var BMIB = (BMIA < arr[1][0]) ? arr[1][0] : arr[1][1];
		return BMI.getWeightDifferenceBetweenTwoBMIS( height, BMIA, BMIB);
	};
	/**
	* Calculates the weight difference between two BMI values but finds the range.
	* Compares BMIB - BMIA.
	* Must be in the metric unit.
	* @param {String} gender - male or female
	* @param {Number} height - metric in KG
	* @param {Number} BMIA - BMI value
	* @param {Number} BMIForTargetRange - BMI value (This is be converted to a range)
	* @param {Number} weight in KG 
	*/
	BMI.getWeightDifferenceBetweenBMIRangeName = function(gender, height, BMIA, BMIForTargetRange ){
		if( !BMI.STATUS[gender] || !BMI.STATUS[gender][ BMIForTargetRange ] ){
			throw new Error("Cant' find BMI.STATUS['"+gender+"']['" + BMIForTargetRange + "']");
		}
		var obj = BMI.STATUS[gender][ BMIForTargetRange ];
		BMIForTargetRange = obj.BMI[0] < BMIA ? obj.BMI[1] : obj.BMI[0];
		return BMI.getWeightDifferenceBetweenBMIRange(gender, height, BMIA, BMIForTargetRange );
	};
	/**
	* @param {String} Gender - Must be "female" or "male"
	* @param {Number} BMI
	* @return {Array} index 0 is the status. index 1 is the BMI status range = [lowest, highest]
	*/
	BMI.getBMIInRangeOfStatus = function(gender, val){
		var range, 
			status,
			obj = BMI.STATUS[ UNIT.parseGender( this.gender ) ];
			
		for(var prop in obj){
			if( !obj.hasOwnProperty(prop)){
				continue;
			}
			var arr = obj[ prop ].BMI;
			if( arr[0] <= val && val <= arr[1] ){
				range = arr;
				status = prop;
				break;
			}
		}
		return [status, range];
	};
	BMI.prototype = {
		constructor : BMI,
		toString : function () {
			return this.valueOf() + " kg/m^2";
		},
		toLocaleString : function () {
			return [
				"Gender: " + this.gender,
				"BMI: " + this.valueOf(),
				"Weight: " + this.weight + "kg",
				"Height: " + this.height + "m",
				"Status: " + this.getStatus()
			].join(", ");
		},
		toJSON : function () {
			return {
				gender : this.gender,
				height : this.height,
				weight : this.weight,
				BMI : this.valueOf()
			};
		},
		valueOf : function () {
			return Number((this.weight / Math.pow(this.height, 2)).toFixed(UNIT.WEIGHT_PRECISION));
		},
		/**
		* 
		*/
		convertToMetric : function () {
			if (!this.isMetric) {
				this.height = UNIT.parseStandardHeightToMetric(this.height);
				this.weight = UNIT.parseStandardWeightToMetric(this.weight);
				this.isMetric = true;
			}
			return this;
		},
		/**
		* 
		*/
		normalizeInput : function () {
			this.convertToMetric();
			this.height = Number( parseFloat(this.height).toFixed(UNIT.WEIGHT_PRECISION) );
			this.weight = Number( parseFloat(this.weight).toFixed(UNIT.WEIGHT_PRECISION) );
			return this;
		},
		getStatus : function(){
			return BMI.getBMIInRangeOfStatus(this.gender, this.valueOf() )[0];
		},
		getWeightDifferenceBetweenBMI : function(BMIB){
			return BMI.getWeightDifferenceBetweenTwoBMIS(this.height, this.valueOf(), BMIB);
		},
		getWeightDifferenceBetweenBMIRange : function(BMIRange){
			return BMI.getWeightDifferenceBetweenBMIRange(this.gender, this.height, this.valueOf(), BMIRange );
		},
		getWeightDifferenceBetweenBMIRangeName : function(BMIRangeName){
			return BMI.getWeightDifferenceBetweenBMIRange(this.gender, this.height, this.valueOf(), BMIRangeName );
		}
	};
	BMI.STATUS = {
		"male" : {
			"anorexia" : {
				BMI : [0, 17.5]
			},
			"underweight" : {
				BMI : [17.51, 20.7]
			},
			"healthy" : {
				BMI : [20.71, 26.4]
			},
			"marginally overweight" : {
				BMI : [26.41, 27.8]
			},
			"overweight" : {
				BMI : [27.81, 31.1]
			},
			"obese" : {
				BMI : [31.11, 35]
			},
			"severely obese" : {
				BMI : [35.01, 40]
			},
			"morbidly obese" : {
				BMI : [40.01, 50]
			},
			"super obese" : {
				BMI : [50.01, 60]
			}
		},
		"female" : {
			"anorexia" : {
				BMI : [0, 17.5]
			},
			"underweight" : {
				BMI : [17.51, 19]
			},
			"healthy" : {
				BMI : [19.01, 25.8]
			},
			"marginally overweight" : {
				BMI : [25.81, 27.3]
			},
			"overweight" : {
				BMI : [27.31, 32.3]
			},
			"obese" : {
				BMI : [32.31, 35]
			},
			"severely obese" : {
				BMI : [35.01, 40]
			},
			"morbidly obese" : {
				BMI : [40.01, 50]
			},
			"super obese" : {
				BMI : [50.01, 60]
			}
		}
	};
	return BMI;
}
	());
/**
 * Body
 * @purpose Provides a class to store a i <br/>
 * Supports both metric and standard units.
 * @date Nov 28, 2012
 * @version 0.1
 * @author Larry Battle <http://bateru.com/news>
 *
 */
var Body = (function () {
	var Body = function (o) {
		if(!o || typeof o !== "object" ){
			throw new Error("The Body constructor requires an object to be passed.");
		}
		if (!(this instanceof Body)) {
			return new Body(o);
		}
		this.age = o.age || 0;
		this.height = o.height;
		this.weight = o.weight;
		this.gender = UNIT.parseGender( o.gender );
		this.hipCircumference = o.hipCircumference;
	};
	Body.prototype = {
		constructor : Body,
		toString : function () {
			// return under, normal, over, obese
		},
		toLocaleString : function () {
			// return under, normal, over, obese + BMI + BAI
		},
		toJSON : function () {
			return {
				age : this.age,
				height : this.height,
				weight : this.weight,
				hipCircumference : this.hipCircumference,
				constructor : "Body"
			};
		}
	};
	return Body;
}());

var BAI = (function () {
	var BAI = function (o) {
		if (!o || typeof o !== "object") {
			throw new Error("BAI constructor requires for an object to be passed.");
		}
		if (!(this instanceof BAI)) {
			return new BAI(o);
		}
		this.gender = UNIT.parseGender( o.gender );
		this.age = o.age;
		this.height = o.height;
		// ?? What's the unit?
		this.hipCircumference = o.hipCircumference;
	};
	BAI.prototype = {
		constructor : BAI,
		toString : function () {
			return this.valueOf() + " cm / m^1.5";
		},
		toLocaleString : function () {
			return [
				"BMI: " + this.valueOf(),
				"for",
				"gender: " + this.gender,
				"age:" + this.age,
				"height: " + this.height,
				"hipCircumference: " + this.hipCircumference
			].join(" ");
		},
		toJSON : function () {
			return {
				constructor : "BAI",
				age : this.age,
				height : this.height,
				gender : this.gender,
				hipCircumference : this.hipCircumference
			};
		},
		valueOf : function () {
			return Number((this.hipCircumference / Math.pow(this.height, 1.5)).toFixed( UNIT.WEIGHT_PRECISION ));
		},
		/**
		* 
		*/
		getHealthStatus : function () {
			var val = this.valueOf(),
				baiObj,
				status,
				obj = BAI.STATUS[ this.gender ];
				
			for(var prop in obj){
				if( !obj.hasOwnProperty(prop)){
					continue;
				}
				if( obj[prop].BAIRange[0] <= val && obj[prop].BAIRange[1] <= val ){
					status = prop;
					baiObj = obj[prop].BAIRange;
				}
			}
			return [status, baiObj];
		}
	};
	BAI.STATUS = {
		"male" : {
			"underweight" : {
				BAIRange : [0, 13],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [0, 8]
					}, {
						age : [40, 59],
						BAI : [0, 11]
					}, {
						age : [60, 79],
						BAI : [0, 13]
					}
				]
			},
			"normal" : {
				BAIRange : [8.01, 25],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [8.01, 21]
					}, {
						age : [40, 59],
						BAI : [11.01, 23]
					}, {
						age : [60, 79],
						BAI : [13.01, 25]
					}
				]
			},
			"overweight" : {
				BAIRange : [21.01, 31],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [21.01, 26]
					}, {
						age : [40, 59],
						BAI : [23.01, 29]
					}, {
						age : [60, 79],
						BAI : [25.01, 31]
					}
				]
			},
			"obese" : {
				BAIRange : [26.01, Infinity],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [26.01, Infinity]
					}, {
						age : [40, 59],
						BAI : [29.01, Infinity]
					}, {
						age : [60, 79],
						BAI : [31.01, Infinity]
					}
				]
			}
		},
		"female" : {
			"underweight" : {
				BAIRange : [0, 25],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [0, 21]
					}, {
						age : [40, 59],
						BAI : [0, 23]
					}, {
						age : [60, 79],
						BAI : [0, 25]
					}
				]
			},
			"normal" : {
				BAIRange : [21.01, 38],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [21.01, 33]
					}, {
						age : [40, 59],
						BAI : [23.01, 35]
					}, {
						age : [60, 79],
						BAI : [25.01, 38]
					}
				]
			},
			"overweight" : {
				BAIRange : [33.01, 43],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [33.01, 39]
					}, {
						age : [40, 59],
						BAI : [35.01, 41]
					}, {
						age : [60, 79],
						BAI : [38.01, 43]
					}
				]
			},
			"obese" : {
				BAIRange : [39.01, Infinity],
				ageAndBAIs : [{
						age : [20, 39],
						BAI : [39.01, Infinity]
					}, {
						age : [40, 59],
						BAI : [41.01, Infinity]
					}, {
						age : [60, 79],
						BAI : [43.01, Infinity]
					}
				]
			}
		}
	};
	return BAI;
}());
