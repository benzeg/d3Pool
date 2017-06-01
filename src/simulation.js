/*Dependencies*/
const Victor = require('victor');
const ForceSimulation = require('./forceSimulation.js').forceSimulation;
////////////////////////////////////////////////////////////////

const Init = (nodes, cueForce, tickEvent) => {
	const cb = function() {
		simulation.resume();
	}

	const simulation = new ForceSimulation();
	simulation.addNodes(nodes)
						.on('tick', () => { tickEvent(cb); });

	simulation.applyForce(cueForce);
}

module.exports = {
	init: Init
}