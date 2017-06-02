var Victor = require('victor');

class forceSimulation {
	constructor() {
		this.nodes = null;
		this.events = {};
		this.timeVec = new Victor(0.1, 0.1);
		this.friction = new Victor(1, 1);
		this.forceVec = [];
		//**refactor to bitwise operation
		this.moved = [];
		this.run = true;
	}

	on(event, cb) {
		this.events[event] = cb;
		return this;
	}

	emit(event, param) {
		if (this.events[event]) {
			this.events[event](param);
		}
	}

	resume() {
		this.run = true;
	}

	pause() {
		this.run = false;
	}

	addNodes(nodes) {
		this.nodes = nodes;
		//***refactor to bitwise operation
		var i = 0;
		while (i < this.nodes.length) {
			this.moved.push(0);
			i++;
		}
		return this;
	}

	applyForce(forceVec) {
		this.forceVec.push(forceVec);
		this.move = setInterval(() => {
			if(this.run) {
				if (!this.checkForceVec()) {
					clearInterval(this.move);
				} else {
					this.pause();
					//apply force vector to node position
					this.nodes.forEach((node, index) => {
						if (this.forceVec[index]) {
							//calculate translation vector here
							var transVec = this.forceVec[index].clone().multiply(this.timeVec);
							node.cx += transVec.x;
							node.cy += transVec.y;
							//moved marks if a node has an active movement at the present time
							this.moved[index] = 1;
							//apply friction to force vector
							var friction = this.forceVec[index].clone().normalize().multiply(this.friction);
							if (Math.ceil(this.forceVec[index].clone().divide(this.friction).x) === 0) {
								this.forceVec[index].x = 0;
								this.forceVec[index].y = 0;
							} else {
								this.forceVec[index].subtract(friction);
							}
							//remove force vector if it becomes stationary
							if (Math.floor(Math.abs(this.forceVec[index].x)) === 0 && Math.floor(Math.abs(this.forceVec[index].y)) === 0) {
								this.forceVec[index] = undefined;
								this.moved[index] = 0;
							}
						}
						//check that all nodes have been traversed
						if (index === this.nodes.length -1) {
						//emit event to update dom
						var cb = () => {
							this.emit('tick');
						}
						//last tasks to do before sending nodes back to rerender is to check for any collisions
						this.checkCollisions(cb);
						} 
					});
				}
			}
		}, 20);
	}

	checkCollisions(cb) {
		var counter = 0;
		this.nodes.forEach((node, index) => {
			//check ball to ball collision
			this.b2bCollision(index, () => {
				counter++;
			});
			this.moved[index] = 0;
			if (counter === this.nodes.length) {
				//check ball to wall collision
				this.b2wCollision(cb);
			}
		});
	}

	b2bCollision(currIndex, cb) {
		if (this.moved[currIndex] === 1) {
			var r1 = this.nodes[currIndex].r;
			var cx1 = this.nodes[currIndex].cx;
			var cy1 = this.nodes[currIndex].cy;
			var collide = false;
			for (var index = 0; index < this.nodes.length; index++) {
				if (index !== currIndex) {
					//two circles collide if Square(r1 + r2) < Square(x1 - x2) + Sqaure(y1 - y2)
					var r2 = this.nodes[index].r;
					var cx2 = this.nodes[index].cx;
					var cy2 = this.nodes[index].cy;
					var distance = Math.sqrt(Math.pow(cx1 - cx2, 2) + Math.pow(cy1 - cy2, 2));
					if ((32.5) >= distance) {
						//perfect elastic collision
						collide = true;
						//calculate force direction vector based on ball A and ball B center points
						var newCoord = [cx2 - cx1, cy2 - cy1];
						var newVec = new Victor.fromArray(newCoord);
						newVec.normalize();
						//translate current force vector magnitude to new force vector
							//hacky right now and just multiplies both x and y vectors by magnitude
						var magnitude = this.forceVec[currIndex].length();
						newVec.x *= magnitude;
						newVec.y *= magnitude;
						//add vectors if ball B is already in motion, otherwise set ball B force vector to new force vector
						if (this.forceVec[index]) {
							this.forceVec[index].add(newVec);
						} else {
							this.forceVec[index] = newVec;
						}
					}
				}
				
				//once all possible collisions have been accounted for and if one or more collisions occur
					//hacky right now and just applies a preset decay force to reverse vector
				if (index === this.nodes.length -1) {
					if (collide) {
						var reflectVec = new Victor.fromArray([0.2, 0.2]);
						this.forceVec[currIndex].invert().multiply(reflectVec);
					}
					return cb();
				}
			};
		} else {
			return cb();
		}
	}

	b2wCollision(cb) {
		//if ball touches bound
		//i) reflect axis that touches bound
		//ii) decrease returned force by 30% to account for wall absorption	
		this.nodes.forEach((node, index) => {
			if (node.cx < 58) {
				if (node.cy < 58 || node.cy > 582) {
					//pocket in
					this.emit('catch', node.id);
					return cb();
				} else {
					node.cx = 56.25;
					this.forceVec[index].x *= -0.7;
				}
			} else if (node.cx > 1142) {
				if (node.cy < 58 || node.cy > 582) {
					//pocket in
					this.emit('catch', node.id);
					return cb();
				} else {
					node.cx = 1143.75;
					this.forceVec[index].x *= -0.7;
				}
			} else if (node.cy < 58) {
				if (node.cx >= 595 && node.cx <= 605) {
					//pocket in
					this.emit('catch', node.id);
					return cb();
				} else {
					node.cy = 56.25;
					this.forceVec[index].y *= -0.7;
				}
			} else if (node.cy > 582) {
				if (node.cx >= 595 && node.cx <= 605) {
					//pocket in
					this.emit('catch', node.id);
					return cb();
				} else {
					node.cy = 583.75;
					this.forceVec[index].y *= -0.7;
				}
			}

			if (index === this.nodes.length -1) {
				return cb();
			}
		});
	}

	checkForceVec() {
		for (var i = 0; i < this.forceVec.length; i++) {
			if (this.forceVec[i] !== undefined) {
				return true;
			}
		}
		return false;
	}
}

module.exports = {
	forceSimulation: forceSimulation
}