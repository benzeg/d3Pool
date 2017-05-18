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
			//normalize force vector
			//forceVec.normalize();
			//check bounds and invert force vector


			if (translateVec.x < 0 || translateVec.x > (1120 - 16.25)) {
				var diff;
				var ratio = Math.abs(forceVec.y/forceVec.x);
				//var reverseForceVec = forceVec.clone().invert();
				if (translateVec.x < 0) {
					diff = 32.50 - translateVec.x;
					console.log(forceVec);
					var k = forceVec.x + diff;
					var rat = k / forceVec.x;
					forceVec.x += diff;
					forceVec.y *= rat;
					console.log(forceVec);
				} else {
					diff = translateVec.x - (1120 - 16.25);
					var k = forceVec.x - diff;
					var rat = k / forceVec.x;
					forceVec.x -= diff;
					forceVec.y *= rat;
				}
			} else if (translateVec.y < 0 || translateVec.y > (560 - 16.25)) {
				var diff;
				var ratio = Math.abs(forceVec.x / forceVec.y);
				var reverseForceVec = forceVec.clone().invert();
				if (translateVec.y < 0) {
					diff = 16.25 - translateVec.y;
					var k = forceVec.y + diff;
					var rat = k / forceVec.y;
					forceVec.y += diff;
					forceVec.x *= rat;
				} else {
					diff = translateVec.y - (560 - 16.25);
					var k = forceVec.y - diff;
					var rat = k / forceVec.y;
					forceVec.y -= diff;
					forceVec.x *= rat;
				}
				//convert x component and add to translate vector
				translateVec = this.cueBallVec.clone().add(forceVec);
				console.log('hello', translateVec);
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