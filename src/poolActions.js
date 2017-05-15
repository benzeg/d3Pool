
var setMouseEvent = function(board, powerGrid, cueBall) {
	var table = board.getTable();
	table.on('mousedown', () => {
		var mousePosition = board.getMouseCoordinates();
		this.powerBarHeight = powerGrid.getHeight();
		this.cueBallPosition = cueBall.getPosition();
		this.positionDiff = [this.cueBallPosition[0] - mousePosition[0], this.cueBallPosition[1] - mousePosition[1]];
		this.powerUp = setInterval(() => {
			//set power bar max height
			if (this.powerBarHeight < 240) {
				this.powerBarHeight++;
				//increase powerGrid height
				if (this.powerBarHeight % 5 === 0) {
					powerGrid.setHeight(this.powerBarHeight);
				}
			}
		}, 10);
	}).on('mouseup', () => {
		//max force: 50N, max velocity: 1500px/sec
		var Vmax = (this.powerBarHeight / 240) * 4500;

		//start ball roll action

		//check boundaries
			//check x axis
			var move = () => {
				//find zeta coefficient
				var z = Math.sqrt(Math.pow(Vmax, 2) / (Math.pow(this.positionDiff[0], 2) + Math.pow(this.positionDiff[1], 2)));

				//calculate translation distance
				var translateX = this.positionDiff[0] * z + this.cueBallPosition[0];
				var translateY = this.positionDiff[1] * z + this.cueBallPosition[1];

				if (translateX < 0) {
					translateX = 16.25;
					this.positionDiff[0] *= -1;
				} else if (translateX > 1120) {
					translateX = 1120 - 16.25;
					this.positionDiff[0] *= -1;
				}

				//check y axis
				if (translateY < 0) {
					translateY = 16.25;
					this.positionDiff[1] *= -1;
				} else if (translateY > 560) {
					translateY = 560 - 16.25;
					this.positionDiff[1] *= -1;
				}

				var travelDistanceX = Math.abs(this.cueBallPosition[0] - translateX);
				var travelDistanceY = Math.abs(this.cueBallPosition[1] - translateY);

				Vmax = Vmax - Math.sqrt(Math.pow(travelDistanceX, 2) + Math.pow(travelDistanceY, 2));


				this.cueBallPosition[0] = translateX;
				this.cueBallPosition[1] = translateY;
				//translate
				console.log(translateX, translateY);
				cueBall.translate([translateX, translateY], () => {
					console.log('triggered');
					if (Vmax > 0) {
						move();
					} else {
						return;
					}
				});
			}

			move();

		//clear increment interval
		this.powerBarHeight = 0;
		powerGrid.setHeight(this.powerBarHeight);
		clearInterval(this.powerUp);
	})
}

module.exports = {
	setMouseEvent: setMouseEvent
}