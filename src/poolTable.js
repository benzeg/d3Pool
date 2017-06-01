/*Dependencies*/
const d3 = require('d3');
const Victor = require('victor');
/////////////////////////////////////////////////////////////////////////////
class Init {
	constructor(container) {
		//STYLING
		this.innerStyle = {
			x: 40,
			y: 40,
			width: 1120,
			height: 560,
			color: '#669133',
		};

		this.outerStyle = {
			width: 1200,
			height: 640,
			color: '#8a3232'
		};

		//html container
		this.container = container;

		//MODEL
		this.model = null;
		this.playArea = null;
	}

	/*
	Generates an outer container representing the entire pool table with
	smaller container inside representing the play area.
	*/
	setUp() {
		this.model = d3.select(container).append('svg:svg')
			.attr('height', this.outerStyle.height)
			.attr('width', this.outerStyle.width)
			.style('background-color', this.outerStyle.color);

		this.playArea = this.model.append('svg:rect')
			.attr('height', this.innerStyle.height)
			.attr('width', this.innerStyle.width)
			.attr('x', this.innerStyle.x)
			.attr('y', this.innerStyle.y)
			.style('fill', this.innerStyle.color);

		return this.model;
	}

	setEvent(event, cb) {
		return this.model.on(event, cb);
	}

	getMouseCoordinates() {
		return new Victor(d3.mouse(this.model._groups[0][0]));
	}

	
}

module.exports = {
	init: Init
}