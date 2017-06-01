/*Dependencies*/
const Victor = require('victor'); //vector library

/*CODE*/
class Init {
	constructor(SVGcontainer) {
		//STYLING
		this.gridStyle = {
			height: 240,
			width: 20,
			fill: '#ffffff'
		};

		this.levelStyle = {
			height: 0,
			width: 20,
			fill: '#8c55555'
		};

		this.positionStyle = {
			x: 1120,
			y: 80
		};

		//SVGs
		this.Container = SVGcontainer;
		this.magnitudeGrid = null;
		this.magnitudeLevel = null;

		//CACHE
		this.maxVelocity = 300; //preset max velocity of 300px/sec
		this.currentMagnitude = null;
	}

	/*
	Generates new magnitude grid svg and adds to pool table svg.
	Grid is set up to include an outer rectangular box with set height and white background
	and an inner grid with initial height of 0, inner grid's height increases dynamically
	to reflect a cue hit's magnitude level.
	*/
	setUp() {
		//populate SVG models
		this.magnitudeGrid = this.Container.append('svg:rect')
			.attr('x', this.positionStyle.x)
			.attr('y', this.positionStyle.y)
			.attr('height', this.gridStyle.height)
			.attr('width', this.gridStyle.width)
			.attr('fill', this.gridStyle.fill);

		this.magnitudeLevel = this.Container.append('svg:rect')
			.attr('x', this.positionStyle.x)
			.attr('y', this.positionStyle.y)
			.attr('height', this.levelStyle.height)
			.attr('width', this.levelStyle.width)
			.attr('fill', this.levelStyle.fill)

		//populate cache
		this.currentMagnitude = 0;
		this.maxmagnitude = this.gridStyle.height;

		return this.magnitudeLevel;
	}

	//calculates force magnitude by comparing current magnitude level to max level
	getMagnitude() {
		return (this.currentMagnitude / this.maxmagnitude) * this.maxVelocity;
	}

	//increases magnitude
	increaseMagnitude() {
		if (this.currentMagnitude === this.magnitudeGrid.attr('height')) {
			return 'Error: At maximum magnitude';
		}
		//only increment while less than max magnitude
		this.currentMagnitude = this.magnitudeLevel.attr('height'); //update cache
		this.magnitudeLevel.attr('height', this.currentMagnitude++);
		return this.currentMagnitude;
	}

	//resets magnitude
	resetMagnitude() {
		this.currentMagnitude = 0;
		this.magnitudeLevel.attr('height', this.currentMagnitude);
		return this.currentMagnitude;
	}

}

module.exports = {
	Init: Init
}