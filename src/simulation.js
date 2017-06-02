/*Dependencies*/
const Victor = require('victor');
const ForceSimulation = require('./forceSimulation.js').forceSimulation;
////////////////////////////////////////////////////////////////
//** todo refactor to class
const Init = (Ball, cueForce, tickEvent, catchEvent) => {
	const cb = function() {
		simulation.resume();
	}

	const simulation = new ForceSimulation();
	simulation.addNodes(Ball)
						.on('tick', () => { tickEvent(cb); })
						.on('catch', (id) => { catchEvent(id); });
	console.log('cueForce', cueForce)
	simulation.applyForce(cueForce);
}

module.exports = {
	Init: Init
}