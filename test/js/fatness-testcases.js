/**
 * @project fatness.js
 * @author Larry Battle , <http://bateru.com/news/>
 * @license MIT
 */
var exports = {};
// contains all tests.
var tests = {};

tests.Unit = function () {
	module("UNIT");
	test("test UNIT.convertStandardHeightToMetric()", function () {
		var fn = UNIT.convertStandardHeightToMetric;
		
		equal(fn().toString(), "NaN");
		equal(fn(0, 0), 0);
		equal(fn(0, 0.1), 0.002539);
		
		equal(fn(3, 12 + 11), 1.49801);
		equal(fn(4, 11), 1.49801);
		equal(fn(0, 12 * 4 + 11), 1.49801);
	});
	test("test UNIT.parseStandardHeightToArray()", function () {
		var fn = UNIT.parseStandardHeightToArray;
		
		deepEqual(fn(), [0,0]);
		deepEqual(fn("234 in"), [0, 234], "");
		
		deepEqual(fn("5'11''"), [5, 11], "");
		deepEqual(fn("5' 11''"), [5, 11], "");
		deepEqual(fn("5'11''"), [5, 11], "");
	
		deepEqual(fn("5' 11 in"), [5, 11], "");
		deepEqual(fn("11 in 5  ft "), [5, 11], "");
		deepEqual(fn("5  ft 11 in"), [5, 11], "");
		deepEqual(fn("5ft 11in"), [5, 11], "");
		deepEqual(fn("234 ft"), [234, 0], "");
		deepEqual(fn("234in"), [0, 234], "");
	});	
	test("test UNIT.convertPoundsToKG()", function(){
		var fn = UNIT.convertPoundsToKG;
		
		equal(fn().toString(), "NaN");
		equal(fn(1), 0.453592);
		equal(fn(23), 10.432616);
		equal(fn(180), 81.64656);
	});
	test("test UNIT.parseStandardWeightToMetric()", function(){
		var fn = UNIT.parseStandardWeightToMetric;
		
		equal(fn().toString(), "NaN");
		equal(fn("180 lb"), 81.64656);
		equal(fn("81.64656 meters"), 81.64656);
	});
};

tests.BMI = function(){
	module("BMI");
	test("test BMI.prototype.toString()", function () {
		var fn = function(o){
			return (new BMI(o)).toString();
		};
		equal(fn({}), "");
	});
	test("test BMI.prototype.toLocaleString()", function () {
		var fn = function(o){
			return (new BMI(o)).toLocaleString();
		};
		equal(fn({}), "");
	});
	test("test BMI.prototype.toJSON()", function () {
		var fn = function(o){
			return (new BMI(o)).toJSON();
		};
		equal(fn({}), "");
	});
	test("test BMI.prototype.valueOf()", function () {
		var fn = function(o){
			return (new BMI(o)).valueOf();
		};
		equal(fn({}), "");
	});
	test("test BMI.prototype.convertToMetric()", function () {
		var fn = function(o){
			return (new BMI(o)).convertToMetric();
		};
		equal(fn({}), "");
	});
	test("test BMI.prototype.normalizeInput()", function () {
		var fn = function(o){
			return (new BMI(o)).normalizeInput();
		};
		equal(fn({}), "");
	});
};

tests.BAI = function(){
	module("BAI");
	test("test BAI.prototype.toString()", function () {
		var fn = function(o){
			return (new BAI(o)).toString();
		};
		equal(fn({}), "");
	});
	test("test BAI.prototype.toLocaleString()", function () {
		var fn = function(o){
			return (new BAI(o)).toLocaleString();
		};
		equal(fn({}), "");
	});
	test("test BAI.prototype.toJSON()", function () {
		var fn = function(o){
			return (new BAI(o)).toJSON();
		};
		equal(fn({}), "");
	});
	test("test BAI.prototype.valueOf()", function () {
		var fn = function(o){
			return (new BAI(o)).valueOf();
		};
		equal(fn({}), "");
	});
	test("test BAI.prototype.getHealthStatus()", function () {
		var fn = function(o){
			return (new BAI(o)).getHealthStatus();
		};
		equal(fn({}), "");
	});
};

tests.Body = function(){
	module("Body");
	test("test Body.prototype.toString()", function () {
		var fn = function(o){
			return (new Body(o)).toString();
		};
		equal(fn({}), "");
	});
	test("test Body.prototype.toLocaleString()", function () {
		var fn = function(o){
			return (new Body(o)).toLocaleString();
		};
		equal(fn({}), "");
	});
	test("test Body.prototype.toJSON()", function () {
		var fn = function(o){
			return (new Body(o)).toJSON();
		};
		equal(fn({}), "");
	});
};

var runTests = function () {
	tests.Unit();
	tests.BAI();
	tests.BMI();
	tests.Body();
};
var reRunTests = function () {
	QUnit.reset(); // should clear the DOM
	QUnit.init(); // resets the qunit test environment
	QUnit.start(); // allows for the new test to be captured.
	runTests();
};
