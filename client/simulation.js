/*Dependencies*/
import * as Victor from 'victor';
import ForceSimulation from './forceSimulation';
////////////////////////////////////////////////////////////////
//** todo refactor to class

const Simulate = (activeNodes, cueForce, tickEvent, catchEvent, cueResume) => {

	const simulation = new ForceSimulation();
	const cb = () => {
		simulation.resume();
	}
	simulation.addNodes(activeNodes)
						.on('tick', () => { tickEvent(cb); })
						.on('catch', (id) => { catchEvent(id); });

	simulation.applyForce(cueForce, cueResume);
}

export default Simulate;