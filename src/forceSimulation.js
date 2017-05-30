var Victor = require('victor');

class forceSimulation {
	constructor() {
		this.nodes = null;
		this.events = {};
		this.timeVec = new Victor(0.01, 0.01);
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
	}

	applyForce(forceVec) {
		this.forceVec.push(forceVec);
		this.move = setInterval(() => {
			if(this.run) {
				//check collision
				updateAllNodes();
				if (!checkForceVec()) {
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
							var friction = this.forceVec[index].clone().normalize();
							this.forceVec[index].subtract(friction);
							//remove force vector if it becomes stationary
							if (this.forceVec[index].x === 0 && this.forceVec[index].y === 0) {
								this.forceVec[index] = undefined;
							}
						} 
					});
					//emit event to update dom
					this.emit('tick');
					this.pause();
				}
			}
		}, 40);

		this.move();
	}

	updateAllNodes() {
		this.nodes.forEach((node, index) => {
			if (this.moved[index] === 1) {
				checkCollision(index);
				this.moved[index] = 0;
			}
		});
		checkWallCollision();
	}

	checkCollision(currIndex) {
		var i = 0;
		var r1 = this.nodes[currIndex].r;
		var cx1 = this.nodes[currIndex].cx;
		var cy1 = this.nodes[currIndex].cy;
		this.nodes.forEach((node, index) => {
			if (index !== currIndex) {
				//two circles collide if Square(r1 + r2) < Square(x1 - x2) + Sqaure(y1 - y2)
				var r2 = node.r;
				var cx2 = node.cx;
				var cy2 = node.cy;
				if ((r1 + r2) < Math.sqrt(Math.pow(cx1 - cx2, 2) + Math.pow(cy1 - cy2, 2))) {
					//perfect elastic collision transfer
					if (this.forceVec[index]) {
						this.forceVec[index].add(this.forceVec[currIndex]);
					} else {
						this.forceVec[index] = this.forceVec[currIndex].clone();
					}
					this.forceVec[currIndex] = undefined;
				}
			}
		});
	}

	checkWallCollision() {
		//currently just stops if hits a wall
		this.nodes.forEach((node, index) => {
			if (node.cx < 16.25) {
				node.cx = 16.25;
				this.forceVec[index] = undefined;
			} else if (node.cx > 1103.75) {
				node.cx = 1103.75;
				this.forceVec[index] = undefined;
			}

			if (node.cy < 16.25) {
				node.cy = 16.25;
				this.forceVec[index] = undefined;
			} else if (node.cy > 543.75) {
				node.cy = 543.75;
				this.forceVec[index] = undefined;
			}
		});
	}

	checkForceVec() {
		this.forceVec.forEach((force) => {
			if (force !== undefined) {
				return true;
			}
		});
		return false;
	}
}

module.exports = {
	forceSimulation: forceSimulation
}