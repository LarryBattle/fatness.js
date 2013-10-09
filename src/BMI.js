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
