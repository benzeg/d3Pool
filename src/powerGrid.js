/*Dependencies*/
var Victor = require('victor'); //vector library

/*CODE*/
class Init {
	constructor(SVGContainer) {
		//STYLING
		this.powerGridOptions = {
			height: 240,
			width: 20,
			x: 1120,
			y: 80,
			fill: '#ffffff'
		}

		this.powerLevelOptions = {
			height: 0,
			width: 20,
			x: 1120,
			y: 80,
			fill: '#8c55555'
		}

		//SVGs
		this.Container = SVGcontainer;
		this.powerGrid = null;
		this.powerLevel = null;

		//CACHE
		this.maxVelocity = 300; //preset max velocity of 300px/sec
		this.currentPower = null;
	}

	/*
	Generates new power grid svg and adds to pool table svg.
	Grid is set up to include an outer rectangular box with set height and white background
	and an inner grid with initial height of 0, inner grid's height increases dynamically
	to reflect a cue hit's power level.
	*/
	setUp() {
		//populate SVG models
		this.powerGrid = this.Container.append('svg:rect')
			.attr('height', this.powerGridOptions.height)
			.attr('width', this.powerGridOptions.width)
			.attr('x', this.powerGridOptions.x)
			.attr('y', this.powerGridOptions.y)
			.attr('fill', this.powerGridOptions.fill);

		this.powerLevel = this.Container.append('svg:rect')
			.attr('height', this.powerLevelOptions.height)
			.attr('width', this.powerLevelOptions.width)
			.attr('x', this.powerLevelOptions.x)
			.attr('y', this.powerLevelOptions.y)
			.attr('fill', this.powerLevelOptions.fill)

		//populate cache
		this.currentPower = 0;
		this.maxPower = this.powerGridOptions.height;

		return;
	}

	//converts current power level to velocity vector by comparing current power level to max power level
	getPower() {
		let v = (this.currentPower / this.maxPower) * this.maxVelocity;
		let velocityVec = new Victor.fromArray([v, v]);
		return velocityVec;
	}

	//increases power level
	incrementPower() {
		if (this.currentPower === this.powerGrid.attr('height')) {
			return 'Error: At maximum power';
		}
		//only increment while less than max power
		this.currentPower = this.powerLevel.attr('height'); //update cache
		this.powerLevel.attr('height', this.currentPower++);
		return this.currentPower;
	}
}

module.exports = {
	Init: Init
}