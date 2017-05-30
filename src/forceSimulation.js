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
	}

	emit(event) {
		if (this.events[event]) {
			this.events[event]();
		}
	}

	resume() {
		this.run = true;
		console.log('resumed');
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
				var cb = () => {
					if (!this.checkForceVec()) {
						clearInterval(this.move);
					} else {
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
						});
						//emit event to update dom
						this.pause();
						this.emit('tick');
					}
				}
				//check collision
				this.updateAllNodes(cb);
			}
		}, 20);
	}

	updateAllNodes(cb) {
		var counter = 0;
		this.nodes.forEach((node, index) => {
			this.checkCollision(index, () => {
				counter++;
			});
			this.moved[index] = 0;
			if (counter === this.nodes.length) {
				this.checkWallCollision(cb);
			}
		});
	}

	checkCollision(currIndex, cb) {
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
					if ((32) >= distance) {
						//perfect elastic collision
						collide = true;
						//for testing purposes
						var newCoord = [cx2 - cx1, cy2 - cy1];
						var newVec = new Victor.fromArray(newCoord);
						newVec.normalize();
						var coeff = this.forceVec[currIndex].length();
						newVec.x *= coeff;
						newVec.y *= coeff;
						if (this.forceVec[index]) {
							// this.forceVec[index].add(this.forceVec[currIndex]);
							this.forceVec[index] = newVec;
						} else {
							// this.forceVec[index] = this.forceVec[currIndex].clone();
							this.forceVec[index] = newVec;
						}
					}
				}
				if (index === this.nodes.length -1) {
					if (collide) {
						this.forceVec[currIndex].invert();
					}
					return cb();
				}
			};
		} else {
			return cb();
		}
	}

	checkWallCollision(cb) {
		//if ball touches bound
		//i) reflect axis that touches bound
		this.nodes.forEach((node, index) => {
			if (node.cx < 16.25) {
				node.cx = 16.25;
				this.forceVec[index].x *= -1;
			} else if (node.cx > 1103.75) {
				node.cx = 1103.75;
				this.forceVec[index].x *= -1;
			}

			if (node.cy < 16.25) {
				node.cy = 16.25;
				this.forceVec[index].y *= -1;
			} else if (node.cy > 543.75) {
				node.cy = 543.75;
				this.forceVec[index].y *= -1;
			}
			if (index === this.nodes.length -1) {
				return cb();
			}
		});
	}

	checkForceVec() {
		console.log(this.forceVec);
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