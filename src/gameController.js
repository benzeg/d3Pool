/*Dependencies*/
const Victor = require('victor');
const VecUtil = require('./vectorUtil/vectorLib.js');
const SetForce = require('./simulation.js').setForce;
/////////////////////////////////////////////////////////////////////////////

const setUp = (Table, PowerGrid, Ball) => {

	/*
	Event to trigger when mouse is held down to charge cue power
	Increase power grid level at a set interval
	*/

	const mouseHold = () => {
		this.powerUp = setInterval(() => {
			PowerGrid.increaseMagnitude();
		}, 10);
	}

	/*
	Event to trigger when mouse is released following a charge
	Calls on a chain of position calculation and update events to update svg positions
	*/
	const mouseRelease = () => {
		//clear power up interval and reset magnitude
		clearInterval(this.powerUp);
		PowerGrid.resetMagnitude();
		//calculate initial force to be exerted on cue ball
		let cueDirection = Ball
			.getCueBallPosition()
			.subtract(Table.getMouseCoordinates())
			.normalize();

		let cueForce = VecUtil.scalarToVec(PowerGrid.getMagnitude(), cueDirection);

		//apply force to cue ball and update nodes' positions


		//

	}
}