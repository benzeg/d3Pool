/*Dependencies*/
import * as Victor from 'victor';
/////////////////////////////////////////////////////////////////////////////

export default class BallModel {
	constructor(SVGcontainer) {
		//STYLING
		this.activeBall = [
			{'cx': 880,
			 'cy': 320,
			 'fill': '#ffcc00',
			 'id': "yellowBall",
			 'class': "activeBall",
			 'r': 16.25},
			{'cx': 908.14,
			 'cy': 303.75,
			 'fill': '#c61313',
			 'id': "redBall",
			 'class': "activeBall",
			 'r': 16.25},
			{'cx': 908.14,
		   'cy': 336.25,
		 	 'fill': '#0c00ff',
			 'id': "blueBall",
			 'class': "activeBall",
			 'r': 16.25},
		 	{'cx': 936.28,
		 	 'cy': 287.50,
		 	 'fill': '#ff7a08',
			 'id': "orangeBall",
			 'class': "activeBall",
			 'r': 16.25},
		 	{'cx': 936.28,
		  	 'cy': 320,
		  	 'fill': '#6308a9',
			 'id': "purpleBall",
			 'class': "activeBall",
			 'r': 16.25},
		  	{'cx': 936.28,
		  	 'cy': 352.50,
		 	 'fill': '#035b3b',
			 'id': "greenBall",
			 'class': "activeBall",
			 'r': 16.25},
		  	{'cx': 320,
			 'cy': 320,
			 'fill': "#ffffff",
			 'id': "cueBall",
			 'class': "activeBall",
			 'r': 16.25}
		];

		//SVG container
		this.Container = SVGcontainer;

		//MODEL
		this.activeModel = null; //balls that are currently in play
		this.inactiveModel = null; //balls removed from play (pocketed)

		this.inactiveBall = [];
		this.findCue = null;
	};

	/*
	Use preset data to generate a selection of active ball svg circles
	*/
	setUp() {
		this.activeModel = this.Container.selectAll('.activeBall')
			.data(this.activeBall)
			.enter()
			.append('svg:circle');

		this.activeModel
			.attr('r', (d)=> d.r)
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
		//put cue back in play at start position if it got put in inactive
		if( this.findCue !== null ) {
			const cueBall = this.inactiveBall.splice( this.findCue, 1 ).pop();
			cueBall.class = 'activeBall';
			cueBall.cx = 320, cueBall.cy = 320;
			this.activeBall.push( cueBall );	
			this.findCue = null;
		}	
		//update active model
		//bind model with active nodes
		this.activeModel = this.Container.selectAll('.activeBall')
			.data(this.activeBall);

		//remove any inactive nodes 
		this.activeModel
			.exit().remove();

		this.activeModel
			.enter()
			.append('svg:circle'); //add new active nodes, if any

		//update active node positions
		this.activeModel
			.attr('r', (d)=> d.r)
			.attr('class', (d) => d.class)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);

		//update inactive model
		this.inactiveModel = this.Container.selectAll('.inactiveBall')
			.data(this.inactiveBall)
			.enter()
			.append('svg:circle')

		this.inactiveModel
			.attr('r', (d)=> d.r)
			.attr('class', (d) => d.class)
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.style('fill', (d) => d.fill)
			.attr('id', (d) => d.id);

		return cb();
	};

	//sends currently active style list
	getActiveNodes() {
		return this.activeBall;
	};

	//***************************************//
	//Single ball functions

	//cue ball node is always found at the end of the activeBall style list, returns vector position
	getCueBallPosition() {
		return new Victor.fromArray([this.activeBall[this.activeBall.length - 1].cx, this.activeBall[this.activeBall.length - 1].cy]);
	};

	/*
		Node to be removed from play is identified by its unique id.
	*/
	updateNode(id) {
		return this.activeBall = this.activeBall.filter((d) => {
			if (d.id === id) {
				d.class = 'inactiveBall';
				d.cx = 80 + 40*this.inactiveBall.length;
				d.cy = 20;
				this.inactiveBall.push(d);
				//mark location if cueBall gets put out of play, to be placed back in play during updateModels
				if(id === 'cueBall') { this.findCue = this.inactiveBall.length - 1 };
				return false;
			}
			return true;
		});
	};
};