
var setMouseEvent = function(board, powerGrid, cueBall) {
	var table = board.getTable();
	table.on('mousedown', () => {
		var mousePosition = board.getMouseCoordinates();
		this.powerBarHeight = powerGrid.getHeight();
		this.cueBallPosition = cueBall.getPosition();
		this.positionDiff = [mousePosition[0] - this.cueBallPosition[0], mousePosition[1] - this.cueBallPosition[1]];
		this.powerUp = setInterval(() => {
			this.powerBarHeight++;
			//increase powerGrid height
			if (this.powerBarHeight % 5 === 0) {
				powerGrid.setHeight(this.powerBarHeight);
			}
		}, 10);
	}).on('mouseup', () => {
		var power = (this.powerBarHeight / 240) * 300;

		//find zeta coefficient
		var z = Math.sqrt(Math.pow(power, 2) / (Math.pow(this.positionDiff[0], 2) + Math.pow(this.positionDiff[1], 2)));
		
		//calculate translation distance
		var translateCoord = [this.positionDiff[0] * -1 * z + this.cueBallPosition[0], this.positionDiff[1] * -1 * z + this.cueBallPosition[1]];

		//translate
		cueBall.translate(translateCoord);

		//clear increment interval
		this.powerBarHeight = 0;
		powerGrid.setHeight(this.powerBarHeight);
		clearInterval(this.powerUp);
	})
}

module.exports = {
	setMouseEvent: setMouseEvent
}