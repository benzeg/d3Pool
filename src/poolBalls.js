class Ball {
	constructor(board) {
		this.board = board;
		this.model = null;
		this.ballOptions = null;
		this.class = null;
		this.velocity = null;
	}

	addBall() {
		this.model = this.board.selectAll(this.class)
			.data(this.ballOptions)
			.enter()
			.append('circle')

		this.model
			.attr('cx', (d) => d.cx)
			.attr('cy', (d) => d.cy)
			.attr('r', (d) => d.r)
			.style('fill', (d) => d.fill)
			.attr('class', (d) => d.class)
	}

	translate(data, cb) {
		this.model.transition() 
			.attr('cx', data[0].cx)
			.attr('cy', data[0].cy)
			.on('end', cb);
	}

	getNodes() {
		return this.ballOptions;
	}

	getModel() {
		return this.model;
	}
}

class CueBall extends Ball {
	constructor(board) {
		super(board);
		this.ballOptions = [
			{'cx': 280,
			 'cy': 280,
			 'r': '16.25px',
			 'fill': "#ffffff",
			 'class': "cueball",
			 'velocity': 0
			}
		];
		this.class = '.cueball';
	}

	getPosition() {
		return [this.ballOptions[0].cx, this.ballOptions[0].cy];
	}
}

class GameBall extends Ball {
	constructor(board) {
		super(board);
		this.ballOptions = [
			{'cx': 840,
			 'cy': 280,
			 'r': '16.25px',
			 'fill': '#ffcc00',
			 'class': 'gameball',
			 'velocity': 0},
			{'cx': 868.14,
			 'cy': 263.75,
			 'r': '16.25px',
			 'fill': '#c61313',
			 'class': 'gameball',
			 'velocity': 0},
			{'cx': 868.14,
		   'cy': 296.25,
		   'r': '16.25px',
		 	 'fill': '#0c00ff',
		 	 'class': 'gameball',
			 'velocity': 0},
		 	{'cx': 896.28,
		 	 'cy': 247.50,
		 	 'r': '16.25px',
		 	 'fill': '#ff7a08',
		 	 'class': 'gameball',
			 'velocity': 0},
		 	{'cx': 896.28,
		   'cy': 280,
		   'r': '16.25px',
		   'fill': '#6308a9',
		   'class': 'gameball',
			 'velocity': 0},
		  {'cx': 896.28,
		   'cy': 312.50,
		   'r': '16.25px',
		 	 'fill': '#035b3b',
		 	 'class': 'gameball',
			 'velocity': 0}
		];
		
		this.class = '.gameball';
	}
}

module.exports = {
	CueBall: CueBall,
	GameBall: GameBall
}