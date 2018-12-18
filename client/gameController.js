/*Dependencies*/
import * as Victor from 'victor';
import vecUtil from './vectorUtil/vectorLib';
import simulate from './simulation';
import * as d3 from 'd3';
/////////////////////////////////////////////////////////////////////////////

export default function controller(Table, PowerGrid, Ball, Cue) {

	/*
		Event to trigger when mouse is moved around the game table.
		Calls on a chain of position calculation and update events to update cue position.
	*/

	const mouseMove = function() {
		Table.updateMousePosition(d3.mouse(this));
		if(Cue.rotate) {
			const cueBallPosition = Ball.getCueBallPosition();
			Cue.attachBall(cueBallPosition);
			const cueAngle = Ball
				.getCueBallPosition()
				.subtract(Table.getMouseCoordinates())
				.normalize().angleDeg();
			Cue.updateRotation(cueAngle);	
		}
	}
	/*
	Event to trigger when mouse is held down to charge cue power
	Increase power grid level at a set interval
	*/
	const mouseHold = () => {
		Cue.setMousePosition(Table.getMouseCoordinates());
		Cue.startAnimation();
		Cue.increaseMagnitude();
		PowerGrid.startAnimation();
		PowerGrid.increaseMagnitude();
	}

	/*
	Event to trigger when mouse is released following a charge
	Calls on a chain of position calculation and update events to update svg positions
	*/
	const mouseRelease = function(event) {
		Cue.pause();
		PowerGrid.pause();

		//calculate initial force to be exerted on cue ball
		let cueDirection = Ball
			.getCueBallPosition()
			.subtract(Cue.mousePosition)
			.normalize();

		let cueForce = vecUtil(PowerGrid.getMagnitude(), cueDirection);
		//clear power up interval and reset magnitude
		PowerGrid.resetMagnitude();
		Cue.resetMagnitude();
		Cue.stopAnimation();
		/*
		Initiate 2D elastic collision simulation with nodes, force, and callback function to act
		on each tick of simulation event
		Each tick event triggers a call to Ball svgs' positions on screen
		*/
		//**todo refactor Simulation to class
	
		let activeNodes = Ball.getActiveNodes();
		simulate(activeNodes, cueForce, (cb) => { return Ball.updateModels(cb); }, (id) => {return Ball.updateNode(id)}, ()=>{
				Cue.resume();
				PowerGrid.resume();
				const cueBallPosition = Ball.getCueBallPosition();
				Cue.attachBall(cueBallPosition);
				const cueAngle = Ball
					.getCueBallPosition()
					.subtract(Table.getMouseCoordinates())
					.normalize().angleDeg();
				Cue.updateRotation(cueAngle);
		});
	}

	/*
	Add events to table svg
	*/
	Table.setEvent(['mousedown', 'mouseup', 'mousemove'], [mouseHold, mouseRelease, mouseMove]);
};