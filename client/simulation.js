/*Dependencies*/
import * as Victor from 'victor';
import ForceSimulation from './forceSimulation';
////////////////////////////////////////////////////////////////
//** todo refactor to class
export default function Simulate(activeNodes, cueForce, tickEvent, catchEvent) {
	const cb = () => {
		simulation.resume();
	}

	const simulation = new ForceSimulation();
	simulation.addNodes(activeNodes)
						.on('tick', () => { tickEvent(cb); })
						.on('catch', (id) => { catchEvent(id); });

	simulation.applyForce(cueForce);
}