/////////////////////////////////////////////////////////////////////////////
var ballModel = require('./poolBalls.js');
var tableModel = require('./poolTable.js');
var powerModel = require('./powerGrid.js');
var poolActions = require('./poolActions.js');
/////////////////////////////////////////////////////////////////////////////
class PoolGame {
	constructor() {
		this.board = null;
	}

	setUp(board) {
		this.board = board;
		this.table = new tableModel.Table(this.board);
		this.table.setTable();

		this.powerGrid = new powerModel.PowerGrid(this.table.model);
		this.powerGrid.setUp();

		this.cueBall = new ballModel.CueBall(this.table.model);
		this.cueBall.addBall();

		poolActions.setMouseEvent(this.table, this.powerGrid, this.cueBall);
	}
}	

module.exports = {
	PoolGame: PoolGame
}