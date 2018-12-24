/*Dependencies*/
import * as Victor from 'victor';
import vecUtil from './vectorUtil/vectorLib';
import simulate from './simulation';
import * as d3 from 'd3';
/////////////////////////////////////////////////////////////////////////////

export default function controller(Table, PowerGrid, Ball, Cue) {
	
	const mouseEvt = function() {
		event.preventDefault();
		let position;

		switch(event.type) {
			case "mousemove":
			case "touchmove":
				/*
				   Event to trigger when mouse is moved around the game table.
				   Calls on a chain of position calculation and update events to update cue position.
				 */
				position = event.type === 'mousemove' ? d3.mouse(this): d3.touches(this)[0]; //only deal with a single touch input
				Table.updateMousePosition(position);
				if(Cue.rotate) {
					const cueBallPosition = Ball.getCueBallPosition();
					Cue.attachBall(cueBallPosition);
					const cueAngle = Ball
						.getCueBallPosition()
						.subtract(Table.getMouseCoordinates())
						.normalize().angleDeg();
					Cue.updateRotation(cueAngle);	

				}
				break;
			
			case "mousedown":
			case "touchstart":
				/*
				   Event to trigger when mouse is held down to charge cue power
				   Increase power grid level at a set interval
				 */
				if(event.type === 'touchstart' && event.touches.length < 2) return;
				if(event.type === 'mousedown' && event.which !== 1 ) return; //[1, 2, 3] = [left button, middle button, right button]
				position = event.type === 'mousedown' ? d3.mouse(this): d3.touches(this)[0];
				Table.updateMousePosition(position);	
				Cue.setMousePosition(Table.getMouseCoordinates());
				Cue.startAnimation();
				Cue.increaseMagnitude();
				PowerGrid.startAnimation();
				PowerGrid.increaseMagnitude();
				break;

			case "mouseup":
			case "touchend":
				/*
				   Event to trigger when mouse is released following a charge
				   Calls on a chain of position calculation and update events to update svg positions
				 */
				if(event.type === 'touchend' && event.touches.length !== 1) return;
				if(event.type === 'mouseup' && event.which !== 1) return;
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
				break;

			default: console.log(event.type);
		}

	}
	/*
	   Add events to table svg
	 */
	Table.setEvent(['mousedown', 'touchstart', 'mouseup', 'touchend', 'mousemove', 'touchmove'], mouseEvt);

};
