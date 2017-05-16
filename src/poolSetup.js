/////////////////////////////////////////////////////////////////////////////
var ballModel = require('./poolBalls.js');
var tableModel = require('./poolTable.js');
var powerModel = require('./powerGrid.js');
var poolActions = require('./poolActions.js');
/////////////////////////////////////////////////////////////////////////////
class PoolGame {
	constructor() {
		this.board = null;
		this.gameBallOptions = [
			{'cx': 840,
			 'cy': 280,
			 'color': '#ffcc00'},
			{'cx': 868.14,
			 'cy': 263.75,
			 'color': '#c61313'},
			{'cx': 868.14,
		   'cy': 296.25,
		 	 'color': '#0c00ff'},
		 	{'cx': 896.28,
		 	 'cy': 247.50,
		 	 'color': '#ff7a08'},
		 	{'cx': 896.28,
		   'cy': 280,
		   'color': '#6308a9'},
		  {'cx': 896.28,
		   'cy': 312.50,
		 	 'color': '#035b3b'}
		];
		this.gameBalls = [];
	}

	setUp(board) {
		this.board = board;
		this.table = new tableModel.Table(this.board);
		this.table.setTable();

		this.powerGrid = new powerModel.PowerGrid(this.table.model);
		this.powerGrid.setUp();

		this.cueBall = new ballModel.CueBall(this.table.model);
		this.cueBall.addBall();

		for (var i = 0; i < this.gameBallOptions.length; i++) {
			var gameBall = new ballModel.GameBall(this.table.model, this.gameBallOptions[i]);
			gameBall.addBall();
			this.gameBalls.push(gameBall);
		}
		
		poolActions.setMouseEvent(this.table, this.powerGrid, this.cueBall);
	}
}	

module.exports = {
	PoolGame: PoolGame
}