/*Dependencies*/
const TableModel = require('./poolTable.js');
const PocketModel = require('./poolPocket.js');
const PowerModel = require('./powerGrid.js');
const BallModel = require('./poolBall.js');
const ControlModel = require('./gameController.js');
/////////////////////////////////////////////////////////////////////////////
class Init {
	constructor(HTMLcontainer) {
		//html container
		this.Container = HTMLcontainer;

		//MODELS
		this.Table = null;
		this.Pocket = null;
		this.PoolBalls = null;
	}

	/*
	i)	Generate new game object models and calls on set to add their svg elements to DOM
			Includes: 
		  	1)pool table
		  	2)pool pockets
		  	3)power grid
		  	4)pool balls
	ii)	Initiate game control listeners
	*/
	newGame() {
		//game table contains an svg:svg element inserted into a div container
		this.Table = new TableModel.Init(this.Container);
		this.Table.setUp();

		//game pocket contains a selection of svg:circle elements inserted into game table svg container
		this.Pocket = new PocketModel.Init(this.Table.getModel());
		this.Pocket.setUp();

		///power grid contains two svg:rect elements inserted into game table svg container
		this.PowerGrid = new PowerModel.Init(this.Table.getModel());
		this.PowerGrid.setUp();

		//ball contains a selection of svg:circle elements inserted into game table svg container 
		this.Ball = new BallModel.Init(this.Table.getModel());
		this.Ball.setUp();
	
		//game control assigns game logic to game objects
		ControlModel.setUp(this.Table, this.PowerGrid, this.Ball)
	}
}	

module.exports = {
	Init: Init
}