/*Dependencies*/
const d3 = require('d3');
const Victor = require('victor');
/////////////////////////////////////////////////////////////////////////////
export default class PoolTable {
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
		this.coordinates;
	}

	/*
	Generates an outer container representing the entire pool table with
	smaller container inside representing the play area.
	*/
	setUp = () => {
		this.model = d3.select(this.container).append('svg:svg')
			.attr('id', 'table')
			.attr('viewBox', `0 0 ${this.outerStyle.width} ${this.outerStyle.height}`)
			.attr('preserveAspectRatio', 'xMidYMid')
			.attr('height', '100%')
			.attr('width', '100%')
			.style('background-color', this.outerStyle.color);

		this.playArea = this.model.append('svg:rect')
			.attr('height', this.innerStyle.height)
			.attr('width', this.innerStyle.width)
			.attr('x', this.innerStyle.x)
			.attr('y', this.innerStyle.y)
			.style('fill', this.innerStyle.color);
	}

	setEvent = (event, cb) => {
		this.model.on(event[0], cb[0])
			.on(event[1], cb[1])
			.on(event[2], cb[2]);
	}

	getMouseCoordinates = () => {
		return new Victor.fromArray(this.coordinates);
	}

	updateMousePosition = ( coordinates ) => {
		this.coordinates = coordinates;
	}

	getModel = () => {
		return this.model;
	}
}
