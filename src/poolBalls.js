class Ball {
	constructor(board, cx, cy) {
		this.cx = cx;
		this.cy = cy;
		this.board = board;
		this.radius = '16.25px';
		this.color = '#808080';
		this.model = null;
	}

	addBall() {
		this.model = this.board.append('svg:circle')
			.attr('cx', this.cx)
			.attr('cy', this.cy)
			.attr('r', this.radius)
			.style('fill', this.color)
	}

	translate(newCoordinates, cb) {
		this.model.transition() 
			.attr('cx', newCoordinates[0])
			.attr('cy', newCoordinates[1])
			.on('end', cb);
	}

	getPosition() {
		return [this.model._groups[0][0].cx.animVal.value, this.model._groups[0][0].cy.animVal.value];
	}
}

class CueBall extends Ball {
	constructor(board) {
		super(board);
		this.color = '#ffffff';
		this.cx = '280px';
		this.cy = '280px';
	}
}

class GameBall extends Ball {
	constructor(board, ballOptions) {
		super(board, ballOptions.cx, ballOptions.cy);
		console.log('hello')
		this.color = ballOptions.color;
	}
}

class BlackBall extends Ball {
	constructor(board, cx, cy) {
		super(cx, cy, board);
		this.color = '#000000';
	}
}

module.exports = {
	CueBall: CueBall,
	GameBall: GameBall,
	BlackBall: BlackBall
}