/*Dependencies*/
const d3 = require('d3');
const Victor = require('victor');
/////////////////////////////////////////////////////////////////////////////
export default class PoolTable {
	constructor(wrapper) {
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

		//view wrapper
		this.Wrapper = d3.select( wrapper )
				.style("position", "absolute")
				.style("height", "100vh")
				.style("width", "100vw")
				.style("top", "0")
				.style("left", "0")
				.style("display", "flex")
				.style("justify-content", "center")
				.style("align-items", "center");
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
		const container = this.Wrapper.append('div')
			.style("padding", "10px")
			.style("width", "100%")
			.style("max-width", "1200px")
			.style("max-height", "640px")
			.style("box-sizing", "border-box");

		this.model = container.append('svg:svg')
			.attr('id', 'table')
			.attr('viewBox', `0 0 ${this.outerStyle.width} ${this.outerStyle.height}`)
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
