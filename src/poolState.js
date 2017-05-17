var d3 = require('d3-force');

var initSimulation = function(nodes) {
	var simulation = d3.forceSimulation(nodes);
	console.log(simulation)
}

module.exports = {
	initSimulation: initSimulation
};