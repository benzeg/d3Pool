/*Dependencies*/


/////////////////////////////////////////////////////////////////////////////
export default class PoolPocket {
	constructor(SVGcontainer) {
		//STYLING
		this.style = [
			{cx: 50,
			 cy: 50},
			{cx: 600,
			 cy: 40},
			{cx: 1150,
			 cy: 50},
			{cx: 50,
			 cy: 590},
			{cx: 600,
			 cy: 600},
			{cx: 1150,
			 cy: 590}
		];

		this.r = 21;
		this.fill = '#000000';
		this.class = 'pocket';

		//svg container
		this.Container = SVGcontainer;

		//MODEL
		this.model = null;
	}

	/*
	Use preset data to generate a selection of pocket svg circles
	*/
	setUp() {
		//binds data to selection
		this.model = this.Container.selectAll(this.class)
			.data(this.style)
			.enter()
			.append('circle');

		//assigns styling to each svg circle
		this.model
			.attr('class', this.class)
			.attr('r', this.r)
			.attr('fill', this.fill)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)

		return this.model;
	}
}