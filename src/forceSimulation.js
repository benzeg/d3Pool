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
		console.log('initial force', this.forceVec);
		this.move = setInterval(() => {
			console.log('running in interval')
			console.log(this.run)
			if(this.run) {
				//check collision
				this.updateAllNodes();
				console.log('first loop after updating nodes', this.forceVec);
				if (!this.checkForceVec()) {
					console.log('no more force vectors');
					clearInterval(this.move);
				} else {
					//apply force vector to node position
					console.log('applying force now');
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
							console.log(this.forceVec)
							//remove force vector if it becomes stationary
							if (this.forceVec[index].x === 0 && this.forceVec[index].y === 0) {
								this.forceVec[index] = undefined;
							}
						} 
					});
					//emit event to update dom
					this.pause();
					this.emit('tick');
					console.log('tick emitted');
				}
			}
		}, 20);
	}

	updateAllNodes() {
		this.nodes.forEach((node, index) => {
			if (this.moved[index] === 1) {
				this.checkCollision(index);
				this.moved[index] = 0;
			}
		});
		this.checkWallCollision();
	}

	checkCollision(currIndex) {
		var i = 0;
		var r1 = this.nodes[currIndex].r;
		var cx1 = this.nodes[currIndex].cx;
		var cy1 = this.nodes[currIndex].cy;
		for (var index = 0; index < this.nodes.length; index++) {
			if (index !== currIndex) {
				//two circles collide if Square(r1 + r2) < Square(x1 - x2) + Sqaure(y1 - y2)
				var r2 = this.nodes[index].r;
				var cx2 = this.nodes[index].cx;
				var cy2 = this.nodes[index].cy;
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
		};
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