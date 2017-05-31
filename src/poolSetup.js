/*Dependencies*/
var TableModel = require('./poolTable.js');
var PowerModel = require('./powerGrid.js');
var BallModel = require('./poolBall.js');
var ControlModel = require('./gameControl.js');
/////////////////////////////////////////////////////////////////////////////
class PoolGame {
	constructor(HTMLcontainer) {
		//html container
		this.Container = HTMLcontainer;

		//MODELS
		this.GameTable = null;
		this.PoolBalls = null;
		this.GameControl = null;
	}

	/*
	i)	Generate new game object models and calls on set to add their svg elements to DOM
			Includes: 
		  	1)pool table
		  	2)power grid
		  	3)pool balls
	ii)	Initiate game control listeners
	*/
	newGame() {
		//game table contains an svg:svg element inserted into a div container
		this.GameTable = new TableModel.Table(this.Container);
		this.GameTable.setUp();

		///power grid contains two svg:rect elements inserted into game table svg container
		this.PowerGrid = new PowerModel.PowerGrid(this.GameTable);
		this.PowerGrid.setUp();

		//ball contains a d3 selection of svg:circle elements inserted into game table svg container 
		this.Ball = new ballModel.Ball(this.GameTable);
		this.Ball.setUp();
	
		//game control assigns game logic to game objects
		this.GameControl = new ControlModel(this.GameTable, this.PowerGrid, this.Ball)
		this.GameControl.setUp();
	}
}	

module.exports = {
	PoolGame: PoolGame
}