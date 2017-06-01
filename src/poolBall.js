/*Dependencies*/
const Victor = require('victor');
/////////////////////////////////////////////////////////////////////////////

class Init {
	constructor(SVGcontainer) {
		//STYLING
		this.activeClass = 'activeBall';
		this.inactiveClass = "inactiveBall";
		this.r = 16.25;
		this.activeStyle = [
			{'cx': 320,
			 'cy': 320,
			 'fill': "#ffffff",
			 'id': "cueBall",
			 'active': 0},
			{'cx': 880,
			 'cy': 320,
			 'fill': '#ffcc00',
			 'id': "yellowBall",
			 'active': 0},
			{'cx': 908.14,
			 'cy': 303.75,
			 'fill': '#c61313',
			 'id': "redBall",
			 'active': 0},
			{'cx': 908.14,
		   'cy': 336.25,
		 	 'fill': '#0c00ff',
			 'id': "blueBall",
			 'active': 0},
		 	{'cx': 936.28,
		 	 'cy': 287.50,
		 	 'fill': '#ff7a08',
			 'id': "orangeBall",
			 'active': 0},
		 	{'cx': 936.28,
		   'cy': 320,
		   'fill': '#6308a9',
			 'id': "purpleBall",
			 'active': 0},
		  {'cx': 936.28,
		   'cy': 352.50,
		 	 'fill': '#035b3b',
			 'id': "greenBall",
			 'active': 0}
		];

		this.inactiveStyle = [];
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
		this.activeModel = this.Container.selectAll(this.activeClass)
			.data(this.activeStyle)
			.enter()
			.append('svg:circle');

		this.activeModel
			.attr('class', this.activeClass)
			.attr('r', this.r)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);

		this.inactiveModel = this.Container.selectAll(this.inactiveClass)
			.data(this.inactiveStyle)
			.enter()
			.append('svg:circle');

		this.inactiveModel
			.attr('class', this.inactiveClass)
			.attr('r', this.r)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);
	};

	//test
	setActiveStyle(style) {
		this.activeStyle = style; 
	}


	//
	//***************************************//
	//Group functions
	/*
	At this point each node in active style list has been updated with their active status,
	this is based on the 'active' property of each node.
	updateActiveNodes filters the list and updates the inactive style list
	*/
	updateActiveNodes(cb) {
		console.log('activeStyle', this.inactiveStyle)
		var changes = false;
		this.activeStyle = this.activeStyle.filter((d) => {
			if (d.active === 1) {
				changes = changes === false ? true: changes;
				this.addInactiveNode(d);
				return false;
			}
			return true;
		});

		return this.reDraw(cb);
	};

	/*
	At this point pocketed balls should have their styles removed from
	active style list and placed in inactive style list.
	reDraw then binds this updated data to active and inactive models to
	update each selection.
	*/
	reDraw(cb) {
		//update active model
		// this.activeModel = this.Container.selectAll(this.activeClass)
		// 	.data(this.activeStyle)
		// 	.enter()
		// 	.append('svg:circle');
		this.activeModel
			.attr('class', this.activeClass)
			.attr('r', this.r)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);

		//update inactive model
		if (this.inactiveStyle.length > 0) {
			// this.inactiveModel = this.Container.selectAll(this.inactiveClass)
			// .data(this.inactiveStyle)
			// .enter()
			// .append('svg:circle');

			this.inactiveModel
				.attr('class', this.inactiveClass)
				.attr('r', this.r)
				.attr('cx', (d) => d.cx)
				.attr('cy', (d) => d.cy)
				.style('fill', (d) => d.fill)
				.attr('id', (d) => d.id);
		}
		return cb();
	};

	//sends currently active style list
	getActiveNodes() {
		return this.activeStyle;
	};

	//***************************************//
	//Single ball functions

	//cue ball node is always set to index 0 in active style list, returns vector position
	getCueBallPosition() {
		return new Victor.fromArray([this.activeStyle[0].cx, this.activeStyle[0].cy]);
	};

	/*
	Node to be removed from play is identified by its unique id. Its velocity property, if any,
	is also removed
	*/
	removeNode(id) {
		console.log('removeNode', id)
		let activeStyle = this.activeStyle.map((d) => {
			if (d.id === id) {
				d.active = 1;
			}
			return d;
		});
		this.setActiveStyle(activeStyle);
	};

	/*
	Inactive node is added to the inactive ball list, its new cx and cy are calculated according
	to its position in list.
	*/
	addInactiveNode(node) {
		node.cx = 80 + 20 * this.inactiveNum;
		node.cy = 10;
		this.inactiveStyle.push(node);
		this.inactiveNum++;
		return this.inactiveStyle;
	}
};

module.exports = {
	Init: Init
};