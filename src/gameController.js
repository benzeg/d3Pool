/*Dependencies*/
const Victor = require('victor');
const VecUtil = require('./vectorUtil/vectorLib.js');
const Simulation = require('./simulation.js');
/////////////////////////////////////////////////////////////////////////////

const setUp = (Table, PowerGrid, Ball) => {

	/*
	Event to trigger when mouse is held down to charge cue power
	Increase power grid level at a set interval
	*/
	let powerUp;
	const mouseHold = () => {
		powerUp = setInterval(() => {
			PowerGrid.increaseMagnitude();
		}, 10);
	}

	/*
	Event to trigger when mouse is released following a charge
	Calls on a chain of position calculation and update events to update svg positions
	*/
	const mouseRelease = () => {
		//clear power up interval and reset magnitude
		clearInterval(powerUp);
		PowerGrid.resetMagnitude();
		//calculate initial force to be exerted on cue ball
		let cueDirection = Ball
			.getCueBallPosition()
			.subtract(Table.getMouseCoordinates())
			.normalize();

		let cueForce = VecUtil.scalarToVec(PowerGrid.getMagnitude(), cueDirection);

		/*
		Initiate 2D elastic collision simulation with nodes, force, and callback function to act
		on each tick of simulation event
		Each tick event triggers a call to Ball svgs' positions on screen
		*/
		let nodes = Ball.getActiveNodes();
		//**todo refactor Simulation to class
		Simulation.Init(nodes, cueForce, (cb) => { return Ball.updateActiveNodes(cb); }, (id) => {return Ball.removeNode(id)});
	}

	/*
	Add events to table svg
	*/
	Table.setEvent(['mousedown', 'mouseup'], [mouseHold, mouseRelease]);
}

module.exports = {
	setUp: setUp
}