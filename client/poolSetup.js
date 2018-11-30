/*Dependencies*/
import TableModel from './poolTable';
import PocketModel from './poolPocket';
import PowerModel from './powerGrid';
import BallModel from './poolBall';
import CueModel from './poolCue';

import controller from './gameController';
/////////////////////////////////////////////////////////////////////////////
export default class Setup {
	constructor(HTMLcontainer) {
		//html container
		this.Container = HTMLcontainer;

		//MODELS
		this.Table = null;
		this.Pocket = null;
		this.PoolBalls = null;
		this.cue = null;
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
		this.Table = new TableModel(this.Container);
		this.Table.setUp();

		//game pocket contains a selection of svg:circle elements inserted into game table svg container
		this.Pocket = new PocketModel(this.Table.getModel());
		this.Pocket.setUp();

		///power grid contains two svg:rect elements inserted into game table svg container
		this.PowerGrid = new PowerModel(this.Table.getModel());
		this.PowerGrid.setUp();

		//ball contains a selection of svg:circle elements inserted into game table svg container 
		this.Ball = new BallModel(this.Table.getModel());
		this.Ball.setUp();
		
		//cue
		this.Cue = new CueModel(this.Table.getModel());
		this.Cue.setUp();
	
		//game control assigns game logic to game objects
		controller(this.Table, this.PowerGrid, this.Ball, this.Cue);
	}
}	