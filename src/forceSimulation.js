var Victor = require('victor');

class forceSimulation {
	constructor() {
		this.nodes = null;
		this.events = {};
		this.friction = new Victor(1, 1);
		this.timeVec = new Victor(0.01, 0.01);
		this.forceVec = [];
		this.moved = 0;
	}

	on(event, cb) {
		this.events[event] = cb;
	}

	emit(event) {
		if (this.events[event]) {
			this.events[event]();
		}
	}

	addNodes(nodes) {
		this.nodes = nodes;
	}

	applyForce(forceVec) {
		this.forceVec.push(forceVec);
		this.move = setInterval(() => {
			this.nodes.forEach(node, index) {
				if (this.forceVec[index]) {
					var transVec = this.forceVec[index].clone().multiply(this.timeVec);
					node.cx += transVec.x;
					node.cy += transVec.y;
					this.moved[index] = 1;
				} 
			}

			forceVec.subtract(this.friction);

		})
	}

	checkCollision() {
		var i = 0;
		while (i < this.nodes.length) {

		}
	}
}