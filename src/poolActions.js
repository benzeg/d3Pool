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
		var velVec = Victor.fromArray([Vmax, Vmax]);
		var move = () => {
			//get cueball position
			this.cueBallVec = Victor.fromArray(cueBall.getPosition());

			//generate force vector
			var forceVec = this.cueBallVec.clone();
			forceVec.subtract(this.mouseVec);
			//normalize force vector
			forceVec.normalize();
			//add travel distance
			forceVec.multiply(velVec);

			//calculate translation position
			var translateVec = this.cueBallVec.clone().add(forceVec);
			//normalize force vector
			//forceVec.normalize();
			//check bounds and invert force vector

			if (translateVec.x < 16.25) {
				var diffX = -16.25 + translateVec.x;
				var ratio = diffX / forceVec.x;
				var diffY = ratio * forceVec.y;
				var reverseVec = Victor.fromArray([-diffX, -diffY]);
				forceVec.add(reverseVec);
				translateVec = this.cueBallVec.clone().add(forceVec);
			} else if (translateVec.x > 1120 - 16.25) {
				var diffX = 16.26 + (translateVec.x - 1120);
				var ratio = diffX / forceVec.x;
				var diffY = ratio * forceVec.y;
				var reverseVec = Victor.fromArray([-diffX, -diffY]);
				forceVec.add(reverseVec);
				translateVec = this.cueBallVec.clone().add(forceVec);
			}
			if (translateVec.y < 16.25) {
				var diffY = -16.25 + translateVec.y;
				var ratio = diffY / forceVec.y;
				var diffX = ratio * forceVec.x;
				var reverseVec = Victor.fromArray([-diffX, -diffY]);
				console.log('reverseVec', reverseVec);
				console.log('forceVec', forceVec);
				forceVec.add(reverseVec);
				console.log('forceVec', forceVec);
				translateVec = this.cueBallVec.clone().add(forceVec);
			} else if (translateVec.y > 560 - 16.25) {
				var diffY = 16.25 + (translateVec.y - 560);
				var ratio = diffY / forceVec.y;
				var diffX = ratio * forceVec.x;
				var reverseVec = Victor.fromArray([-diffX, -diffY]);
				forceVec.add(reverseVec);
				translateVec = this.cueBallVec.clone().add(forceVec);
			}
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