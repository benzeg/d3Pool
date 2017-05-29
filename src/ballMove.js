var Victor = require('victor');
var d3 = require('d3');

var setSimulation = (ballSVG, ballOption) => {

	function redraw() {
		ball.attr("cx", function(d) { console.log('***', d);return d.x});
		ball.attr("cy", function(d) { return d.y});
		force.resume();
	}

	var simulation = d3.forceSimulation()
				.force("collide", d3.forceCollide())
				.force("y", d3.forceY(0))
        .force("x", d3.forceX(0))

	simulation
		.nodes(balls)
	// 	.enter()
		.on("tick", redraw);
}

module.exports = {
	setForce: setForce
}