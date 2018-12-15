import * as Victor from 'victor';

export default class ForceSimulation {
	constructor() {
		this.nodes = null;
		this.events = {};
		this.timeVec = new Victor(0.1, 0.1);
		this.friction = new Victor(1, 1);
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
		if(!this.run){
			this.run = true;
		};
		this.move = setInterval(() => {
			if(this.run) {
				if (!this.checkForceVec()) {
					clearInterval(this.move);
					cueResume();
				} else {
					this.pause();
					//apply force vector to node position
					this.moved = [];
					let index = 0;

					while (index < this.nodes.length) {
						let node = this.nodes[index];
						let id = node.id;
						if (this.forceVec[id] !== undefined) {
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
							this.forceVec[id] = this.forceVec[id].length() < 1 ? undefined: this.forceVec[id];
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
				}
			}
		}, 20);
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

	b2bCollision=(currIndex, cb) =>{
		if (this.moved[currIndex] === 1) {
			var r1 = this.nodes[currIndex].r;
			var cx1 = this.nodes[currIndex].cx;
			var cy1 = this.nodes[currIndex].cy;
			var collide = false;
			var ballA = this.nodes[currIndex].id;
			for (var index = 0; index < this.nodes.length; index++) {
				if (index !== currIndex) {
					//two circles collide if Square(r1 + r2) < Square(x1 - x2) + Sqaure(y1 - y2)
					var r2 = this.nodes[index].r;
					var cx2 = this.nodes[index].cx;
					var cy2 = this.nodes[index].cy;
					var distance = Math.sqrt(Math.pow(cx1 - cx2, 2) + Math.pow(cy1 - cy2, 2));
					var ballB = this.nodes[index].id;
					if ((32.5) >= distance) {
						//perfect elastic collision
						collide = true;
						//calculate force direction vector based on ball A and ball B center points
						var newCoord = [cx2 - cx1, cy2 - cy1];
						var newVec = new Victor.fromArray( newCoord ).normalize();

						const ballAClone = this.forceVec[ballA].clone().normalize();
						const dotAB = ballAClone.dot( newVec );

						const ballB_magnitude = dotAB * this.forceVec[ballA].length();
						const ballB_y = dotAB * ballB_magnitude;
						const ballB_x = Math.sin( Math.acos( dotAB ) ) & ballB_magnitude;

						console.log(ballB_x, ballB_y);
						
						//translate current force vector magnitude to new force vector
							//hacky right now and just multiplies both x and y vectors by magnitude
						var magnitude = this.forceVec[ballA].length();
						newVec.x *= magnitude;
						newVec.y *= magnitude;

						/*
							new feature


						*/


						/*

							end new feature

						*/

						//add vectors if ball B is already in motion, otherwise set ball B force vector to new force vector
						if (this.forceVec[ballB] !== undefined) {
							this.forceVec[ballB].add(newVec);
						} else {
							this.forceVec[ballB] = newVec;
						}
					}
				}
				
				//once all possible collisions have been accounted for and if one or more collisions occur
					//hacky right now and just applies a preset decay force to reverse vector
				if (index === this.nodes.length -1) {
					if (collide) {
						var reflectVec = new Victor.fromArray([0.2, 0.2]);
						this.forceVec[ballA].invert().multiply(reflectVec);
					}

					//
					if (currIndex === this.nodes.length -1) {
						return cb();
					}
				}
			};
		} else if (currIndex === this.nodes.length -1) {
			return cb();
		}
		return;
	}

	b2wCollision=(cb) =>{
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
					this.forceVec[node.id] = undefined;
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
					this.forceVec[node.id] = undefined;
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
					this.forceVec[node.id] = undefined;
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
					this.forceVec[node.id] = undefined;
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
		for (var key in this.forceVec) {
			if (this.forceVec[key] !== undefined) {
				return true;
			}
		}
		return false;
	}
}