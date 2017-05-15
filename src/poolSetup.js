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
			 'color': '#ffcc00'}
		];
	}

	setUp(board) {
		this.board = board;
		this.table = new tableModel.Table(this.board);
		this.table.setTable();

		this.powerGrid = new powerModel.PowerGrid(this.table.model);
		this.powerGrid.setUp();

		this.cueBall = new ballModel.CueBall(this.table.model);
		this.cueBall.addBall();

		this.gameBall = new ballModel.GameBall(this.table.model, this.gameBallOptions[0].cx, this.gameBallOptions[0].cy, this.gameBallOptions[0].color);
		this.gameBall.addBall();
		poolActions.setMouseEvent(this.table, this.powerGrid, this.cueBall);
	}
}	

module.exports = {
	PoolGame: PoolGame
}