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
