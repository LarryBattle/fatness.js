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
