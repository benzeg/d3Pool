var Victor = require('victor');

var setMouseEvent = function(board, powerGrid, cueBall) {
	var table = board.getTable();
	table.on('mousedown', () => {
		//mouse coordinate
		this.mouseVec = Victor.fromArray(board.getMouseCoordinates());
		this.powerBarHeight = powerGrid.getHeight();
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

		var move = () => {
			//get cueball position
			this.cueBallVec = Victor.fromArray(cueBall.getPosition());

			//generate force vector
			var forceVec = this.cueBallVec.clone();
			forceVec.subtract(this.mouseVec);
			//normalize force vector
			forceVec.normalize();
			//add travel distance
			forceVec.x *= Vmax;
			forceVec.y *= Vmax;

			//calculate translation position
			var translateVec = this.cueBallVec.clone().add(forceVec);

			//check bounds and invert force vector
			if (translateVec.x < 0 || translateVec.x > 1120 - 16.25 || translateVec.y < 0 || translateVec.y > 560 - 16.25) {
				var reverseForceVec = forceVec.clone().invert();
				var ratio = 1;

				if (translateVec.x < 0) {
					ratio = (forceVec.x - translateVec.x) / forceVec.x;
					//
					//translateVec.x = 16.25;
				} else if (translateVec.x > (1120 - 16.25)) {
					ratio = (forceVec.x - (translateVec.x - (1120 - 16.25))) / forceVec.x;
					//
					//translateVec.x = 1120 - 16.25;
				} else if (translateVec.y < 0) {
					ratio = (forceVec.y - translateVec.y) / forceVec.y;
				} else if (translateVec.y > (560 - 16.25)) {
					ratio = (forceVec.y - (translateVec.y - (500 - 16.25))) / forceVec.y;
				}

				forceVec.x *= ratio;
				forceVec.y *= ratio;
				console.log('forceVector', forceVec)
				translateVec = this.cueBallVec.clone().add(forceVec);

			};
			//translate
			// cueBall.translate(translateVec, () => {
			// 	// if (Vmax > 0) {
			// 	// 	move();
			// 	// } else {
			// 	// 	return;
			// 	// }
			// 	console.log('done')
			// });
			cueBall.translate(translateVec);
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