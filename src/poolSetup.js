/////////////////////////////////////////////////////////////////////////////
var ballModel = require('./poolBalls.js');
var tableModel = require('./poolTable.js');
var powerModel = require('./powerGrid.js');
var poolActions = require('./poolActions.js');
var physics = require('./poolState.js');
/////////////////////////////////////////////////////////////////////////////
class PoolGame {
	constructor() {
		this.board = null;
		this.cueBall = null;
		this.gameBall = null;
	}

	setUp(board) {
		this.board = board;
		this.table = new tableModel.Table(this.board);
		this.table.setTable();

		this.powerGrid = new powerModel.PowerGrid(this.table.model);
		this.powerGrid.setUp();

		this.Ball = new ballModel.Ball(this.table.model);
		this.Ball.addBall();
	
		poolActions.setMouseEvent(this.table, this.powerGrid, this.Ball);
	}
}	

module.exports = {
	PoolGame: PoolGame
}