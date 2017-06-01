/*Dependencies*/
const Victor = require('victor');
const ForceSimulation = require('./forceSimulation.js').forceSimulation;
////////////////////////////////////////////////////////////////
//** todo refactor to class
const Init = (nodes, cueForce, tickEvent, catchEvent) => {
	const cb = function() {
		simulation.resume();
	}

	const simulation = new ForceSimulation();
	simulation.addNodes(nodes)
						.on('tick', () => { tickEvent(cb); })
						.on('catch', () => { catchEvent(); });
	console.log(cueForce)
	simulation.applyForce(cueForce);
}

module.exports = {
	Init: Init
}