/*Dependencies*/
const Victor = require('victor');
const ForceSimulation = require('./forceSimulation.js').forceSimulation;
////////////////////////////////////////////////////////////////
//** todo refactor to class
const Init = (activeNodes, cueForce, tickEvent, catchEvent) => {
	const cb = () => {
		simulation.resume();
	}

	const simulation = new ForceSimulation();
	simulation.addNodes(activeNodes)
						.on('tick', () => { tickEvent(cb); })
						.on('catch', (id) => { catchEvent(id); });

	simulation.applyForce(cueForce);
}

module.exports = {
	Init: Init
}