import * as Victor from 'victor';

export default class ForceSimulation {
	constructor() {
		this.nodes = null;
		this.events = {};
		this.timeVec = new Victor(0.15, 0.15);
		this.friction = new Victor(0.6, 0.6);
		this.forceVec = {};
		this.run = false;
	}

	on = (event, cb) => {
		this.events[event] = cb;
		return this;
	}

	emit=(event, param) => {
		if (this.events[event]) {
			this.events[event](param);
		}
	}

	resume=() =>{
		this.run = true;
	}

	pause=() =>{
		this.run = false;
	}

	addNodes=(activeNodes) =>{
		this.nodes = activeNodes;
		return this;
	}

	applyForce=(forceVec, cueResume)=> {
		this.forceVec.cueBall = forceVec;
		this.cueResume = cueResume;	
		if(!this.run){
			this.run = true;
		};
		this.animate()
	}

	animate = () => {
		if(this.run) {
			if(this.checkForceVec()) {
			//apply force vector to node position
				this.moved = [];
				let index = 0;

				while (index < this.nodes.length) {
					let node = this.nodes[index];
					let id = node.id;
					if (this.forceVec[id]) {
						//calculate translation vector here
						var transVec = this.forceVec[id].clone().multiply(this.timeVec);
						node.cx += transVec.x;
						node.cy += transVec.y;

						//moved marks if a node has an active movement at the present time
						this.moved[index] = 1;
						//apply friction to force vector
						var friction = this.forceVec[id].clone().normalize().multiply(this.friction);
						this.forceVec[id].subtract(friction);
						//remove force vector if it becomes stationary
						if(this.forceVec[id].length() < 1) { delete this.forceVec[id] };
					}
					index++;
					//check that all nodes have been traversed
					if (index === this.nodes.length) {
						//emit event to update dom
						var cb = () => {
							this.emit('tick');
						}
						//last tasks to do before sending nodes back to rerender is to check for any collisions
						this.checkCollisions(cb);
					}
				};
				
				this.frameId = window.requestAnimationFrame( this.animate );
			} else {
				window.cancelAnimationFrame( this.frameId );
				this.stopAnimation();
			}
		}
	}

	stopAnimation = () => {
		this.run = false;
		this.cueResume();	
	}

	/*
	At this point all active nodes should be updated with their velocity vector
	Only nodes with an active velocity has a vector in the velocity object
	*/

	checkCollisions=(cb) =>{
		var index = 0;
		while (index < this.nodes.length) {
			this.b2bCollision(index, () => {this.b2wCollision(cb)});
			index++;
		}
	}

	b2bCollision=(currIndex, cb) => {
		if (this.moved[currIndex] === 1 && this.forceVec[this.nodes[currIndex].id]) {
			/************************** */
			var r = this.nodes[currIndex].r;
			var cx1 = this.nodes[currIndex].cx;
			var cy1 = this.nodes[currIndex].cy;
			var ballA = this.nodes[currIndex].id;
			const collisions = [];

			for (var index = 0; index < this.nodes.length; index++) {
				if (index !== currIndex) {
					var cx2 = this.nodes[index].cx;
					var cy2 = this.nodes[index].cy;
					var distance = Math.sqrt(Math.pow(cx1 - cx2, 2) + Math.pow(cy1 - cy2, 2));
					if ((r*2) >= distance) {
						var newCoord = [cx2 - cx1, cy2 - cy1];
						var newVec = new Victor.fromArray( newCoord ).normalize();

						const ballAClone = this.forceVec[ballA].clone().normalize();
						const dotAB = ballAClone.dot( newVec );
						if(dotAB > 0) {
							collisions.push({
								node: this.nodes[index],
								force: newVec,
								dot: dotAB
							});
						}	
					}
				}
			}

			if(collisions.length > 0) {
				let magnitude = 0;	
				if( collisions.length > 3 ) {
					console.log('impossibru', collisions);
					return;
				} else if( collisions.length === 3 ) {
					magnitude = this.forceVec[ballA].length() / 3;
				} else if( collisions.length === 2 ) {
					const theta_avg = collisions.reduce((sum, curr) => sum + Math.acos( curr.dot ), 0) / collisions.length;
					const n = 2 / Math.pow( (2* Math.cos(theta_avg)), 2 );
					const v0 = ((n - 1)/(n + 1))*this.forceVec[ballA].length();	
					magnitude = this.forceVec[ballA].length() - v0;
				} else {
					magnitude = collisions[0].dot * this.forceVec[ballA].length();
				}

				for(let ball of collisions) {
					ball.force.x *= magnitude;
					ball.force.y *= magnitude;

					if(this.forceVec[ball.node.id]) { this.forceVec[ball.node.id].add( ball.force ) } else { this.forceVec[ball.node.id] = ball.force };
					this.forceVec[ballA].subtract(ball.force);
				}	
			}
		}
		if (currIndex === this.nodes.length -1) {
			return cb();
		};
	}

	b2wCollision=(cb) => {
		//if ball touches bound
		//i) reflect axis that touches bound
		//ii) decrease returned force by 30% to account for wall absorption
		let index = 0;
		while (index < this.nodes.length) {
			let node = this.nodes[index];
			let id = node.id;
			if (node.cx < 57) {
				if (node.cy < 57 || node.cy > 583) {
					//pocket in
					this.emit('catch', node.id);
					delete this.forceVec[id];	
				} else {
					node.cx = 56.25;
					if(this.forceVec[id]) {
						this.forceVec[id].x *= -0.7;
					}
				}
			} else if (node.cx > 1142) {
				if (node.cy < 57 || node.cy > 583) {
					//pocket in
					this.emit('catch', node.id);
					delete this.forceVec[id];
				} else {
					node.cx = 1143.75;
					if(this.forceVec[id]) {
						this.forceVec[id].x *= -0.7;
					}
				}
			} else if (node.cy < 57) {
				if (node.cx >= 595 && node.cx <= 605) {
					//pocket in
					this.emit('catch', node.id);
					delete this.forceVec[id];	
				} else {
					node.cy = 56.25;
					if(this.forceVec[id]) {
						this.forceVec[id].y *= -0.7;
					}
				}
			} else if (node.cy > 583) {
				if (node.cx >= 595 && node.cx <= 603.75) {
					//pocket in
					this.emit('catch', node.id);
					delete this.forceVec[id];
				} else {
					node.cy = 583.75;
					if(this.forceVec[id]) {
						this.forceVec[id].y *= -0.7;
					}
				}
			}
			index++;
		}
		return cb();
	}

	checkForceVec=() =>{
		return Object.keys(this.forceVec).length > 0;
	}
}
