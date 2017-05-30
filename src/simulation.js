var Victor = require('victor');
var ForceSimulation = require('./forceSimulation.js').forceSimulation;

var setSimulation = (ballSVG, ballOptions, cueForce) => {

	function redraw() {
		ballSVG.attr("cx", function(d) {return d.cx});
		ballSVG.attr("cy", function(d) {return d.cy});
		simulation.resume();
	}

	var simulation = new ForceSimulation();
	simulation.addNodes(ballOptions)
						.on('tick', redraw);

	simulation.applyForce(cueForce);
}

module.exports = {
	setForce: setSimulation
}