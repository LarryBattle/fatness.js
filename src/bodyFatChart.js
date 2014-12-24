var bodyFatChart = function(weight, bodyFat){
	var baseWeight = weight * ((100 - bodyFat)/100);
	var wpf = (weight * 0.01 * bodyFat) / bodyFat;
	var o = {
		"essential" : [ 2, 5],
		"athletes" : [ 6, 13],
		"fitness" : [ 14, 17],
		"average" : [ 18, 24],
		"obese" : [ 25, 70]
	};
	Object.keys(o).forEach(function(key){
		o[key] = o[key].map(function(val){
			return (baseWeight + (val * wpf)).toFixed(1);
		});
	});
	return {
		bodyFatChart : o
	};
};
var x = bodyFatChart(208, 22.1);

console.log( JSON.stringify(x, null, 2) );
