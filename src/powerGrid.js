class PowerGrid {
	constructor(board) {
		this.board = board;
		this.container = null;
		this.powerGrid = null;
	}

	setUp() {
		this.container = this.board.append('svg:rect')
			.attr('height', 240)
			.attr('width', 20)
			.attr('x', 1080)
			.attr('y', 40)
			.attr('fill', '#ffffff')

		this.powerGrid = this.board.append('svg:rect')
			.attr('height', 0)
			.attr('width', 20)
			.attr('x', 1080)
			.attr('y', 40)
			.attr('fill', '#8c5555')
	}

	getHeight() {
		return this.powerGrid.attr('height');
	}

	setHeight(height) {
		this.powerGrid.attr('height', height);
	}
}

module.exports = {
	PowerGrid: PowerGrid
}