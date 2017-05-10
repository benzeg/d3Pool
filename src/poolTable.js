class Table {
	constructor(container) {
		this.container = container;
		this.xLeft = 0;
		this.xRight = 1120;
		this.yTop = 0;
		this.yBottom = 560;
		this.color = '#648fcb';
		this.model = null;
	}

	setTable() {
		this.model = d3.select(container).append('svg:svg')
			.attr('height', this.yBottom)
			.attr('width', this.xRight)
			.style('background-color', this.color);
	}

	getMouseCoordinates() {
		return d3.mouse(this.model._groups[0][0]);
	}

	getTable() {
		return this.model;
	}
}

module.exports = {
	Table: Table
}