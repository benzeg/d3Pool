var Victor = require('victor');

class forceSimulation {
	constructor() {
		this.nodes = null;
		this.events = {};
	}

	on(event, cb) {
		this.events[event] = cb;
	}

	emit(event) {
		if (this.events[event]) {
			this.events[event]();
		}
	}
}