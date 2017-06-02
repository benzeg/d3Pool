/*Dependencies*/
const Victor = require('victor');
/////////////////////////////////////////////////////////////////////////////

class Init {
	constructor(SVGcontainer) {
		//STYLING
		this.r = 16.25;
		this.ballStyle = [
			{'cx': 320,
			 'cy': 320,
			 'fill': "#ffffff",
			 'id': "cueBall",
			 'class': "activeBall"},
			{'cx': 880,
			 'cy': 320,
			 'fill': '#ffcc00',
			 'id': "yellowBall",
			 'class': "activeBall"},
			{'cx': 908.14,
			 'cy': 303.75,
			 'fill': '#c61313',
			 'id': "redBall",
			 'class': "activeBall"},
			{'cx': 908.14,
		   'cy': 336.25,
		 	 'fill': '#0c00ff',
			 'id': "blueBall",
			 'class': "activeBall"},
		 	{'cx': 936.28,
		 	 'cy': 287.50,
		 	 'fill': '#ff7a08',
			 'id': "orangeBall",
			 'class': "activeBall"},
		 	{'cx': 936.28,
		   'cy': 320,
		   'fill': '#6308a9',
			 'id': "purpleBall",
			 'class': "activeBall"},
		  {'cx': 936.28,
		   'cy': 352.50,
		 	 'fill': '#035b3b',
			 'id': "greenBall",
			 'class': "activeBall"}
		];

		//SVG container
		this.Container = SVGcontainer;

		//MODEL
		this.activeModel = null; //balls that are currently in play
		this.inactiveModel = null; //balls removed from play (pocketed)

		//CACHE
		this.inactiveNum = 0;
	};

	/*
	Use preset data to generate a selection of active ball svg circles
	*/
	setUp() {
		this.activeModel = this.Container.selectAll('.activeBall')
			.data(this.ballStyle)
			.enter()
			.append('svg:circle');

		this.activeModel
			.attr('r', this.r)
			.attr('class', (d) => d.class)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);
	};

	//
	//***************************************//
	//Group functions
	/*
	At this point each node has their properties updated with new positions and in play status
	updateModels then binds this updated data to redraw each selection.
	*/
	updateModels(cb) {
		//update active model
		//bind model with active nodes
		this.activeModel = this.Container.selectAll('.activeBall')
			.data(this.ballStyle.filter((d) => { return d.class === "activeBall"}));

		//remove any inactive nodes 
		this.activeModel
			.exit().remove();

		this.activeModel
			.enter()
			.append('svg:circle'); //add new active nodes, if any

		//update active node positions
		this.activeModel
			.attr('r', this.r)
			.attr('class', (d) => d.class)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);

		//update inactive model
		this.inactiveModel = this.Container.selectAll('.inactiveBall')
			.data(this.ballStyle.filter((d) => {return d.class === "inactiveBall"}))
			.enter()
			.append('svg:circle')

		this.inactiveModel
			.attr('r', this.r)
			.attr('class', (d) => d.class)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);

		return cb();
	};

	//sends currently active style list
	getNodes() {
		return this.ballStyle;
	};

	//***************************************//
	//Single ball functions

	//cue ball node is always set to index 0 in active style list, returns vector position
	getCueBallPosition() {
		return new Victor.fromArray([this.ballStyle[0].cx, this.ballStyle[0].cy]);
	};

	/*
	Node to be removed from play is identified by its unique id.
	Ball status is defined by its class, therefore changing its class attributes toggles
	in play vs not
	*/
	updateNode(id) {
		var index = 0;
		while (index < this.ballStyle.length) {
			if (this.ballStyle[index].id === id) {
				let node = this.ballStyle[index];
				node.class = "inactiveBall";
				node.cx = 100 + 20 * this.inactiveNum;
				node.cy = 20;
				this.inactiveNum++;
				break;
			}
		}
		return this.ballStyle;
	};
};

module.exports = {
	Init: Init
};