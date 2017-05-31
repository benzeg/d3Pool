/*Dependencies*/
var TableModel = require('./poolTable.js');
var PocketModel = require('./poolPocket.js');
var PowerModel = require('./powerGrid.js');
var BallModel = require('./poolBall.js');
var ControlModel = require('./gameControl.js');
/////////////////////////////////////////////////////////////////////////////
class PoolGame {
	constructor(HTMLcontainer) {
		//html container
		this.Container = HTMLcontainer;

		//MODELS
		this.Table = null;
		this.Pocket = null;
		this.PoolBalls = null;
		this.GameControl = null;
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
		this.Pocket = new PocketModel.Init(this.Table);
		this.Pocket.setUp();
		
		///power grid contains two svg:rect elements inserted into game table svg container
		this.PowerGrid = new PowerModel.Init(this.Table);
		this.PowerGrid.setUp();

		//ball contains a selection of svg:circle elements inserted into game table svg container 
		this.Ball = new ballModel.Init(this.Table);
		this.Ball.setUp();
	
		//game control assigns game logic to game objects
		this.GameControl = new ControlModel.Init(this.Table, this.Pocket, this.PowerGrid, this.Ball)
		this.GameControl.setUp();
	}
}	

module.exports = {
	PoolGame: PoolGame
}