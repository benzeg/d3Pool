/*Dependencies*/
import * as Victor from 'victor';
import vecUtil from './vectorUtil/vectorLib';
import simulate from './simulation';
/////////////////////////////////////////////////////////////////////////////

export default function controller(Table, PowerGrid, Ball, Cue) {

	/*
		Event to trigger when mouse is moved around the game table.
		Calls on a chain of position calculation and update events to update cue position.
	*/

	const mouseMove = () => {
		if(Cue.rotate) {
			const cueBallPosition = Ball.getCueBallPosition();
			Cue.attachBall(cueBallPosition);
			const mousePosition = Table.getMouseCoordinates();
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
	let powerUp;	
	const mouseHold = () => {
		Cue.pause();
		PowerGrid.startAnimation();
		PowerGrid.increaseMagnitude();
		Cue.startAnimation();
		Cue.increaseMagnitude();
	}

	/*
	Event to trigger when mouse is released following a charge
	Calls on a chain of position calculation and update events to update svg positions
	*/
	const mouseRelease = () => {
		//calculate initial force to be exerted on cue ball
		let cueDirection = Ball
			.getCueBallPosition()
			.subtract(Table.getMouseCoordinates())
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
			Cue.resume()
			// Cue.attachBall(Ball.getCueBallPosition());
			// const mousePosition = Table.getMouseCoordinates();
			// const cueAngle = Ball
			// 	.getCueBallPosition()
			// 	.subtract(Table.getMouseCoordinates())
			// 	.normalize().angleDeg();
			// Cue.updateRotation(cueAngle);
		});
	}

	/*
	Add events to table svg
	*/
	Table.setEvent(['mousedown', 'mouseup', 'mousemove'], [mouseHold, mouseRelease, mouseMove]);
};