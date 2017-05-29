var Victor = require('victor');
var SetForce = require('./ballMove.js').setForce;

var setMouseEvent = function(board, powerGrid, cueBall, gameBall) {
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
	//fetch cueball and gameball nodes to feed into transition
		var cueballNodes = cueBall.getNodes();
		var gameballNodes = gameBall.getNodes();
		//fetch cueball and gameball svg elements to feed into transition
		var cueSVG = cueBall.getModel();
		var gameSVG = gameBall.getModel();

		//max force: 50N, max velocity: 1500px/sec
		var Vmax = (this.powerBarHeight / 240) * 4500;
		this.velVec = Victor.fromArray([Vmax, Vmax]);
			//get cueball position
		this.cueBallVec = Victor.fromArray(cueBall.getPosition());
		//generate force vector
		this.forceVec = this.cueBallVec.clone();
		this.forceVec.subtract(this.mouseVec);
		//normalize force vector
		this.forceVec.normalize();
		//add travel distance
		this.forceVec.multiply(this.velVec);
		var move = () => {

			//calculate translation position
			var translateVec = this.cueBallVec.clone().add(this.forceVec);
			//check collision with other balls

			//remaining force;
			var reverseVec;
			//check bounds and invert force vector
			if (translateVec.x < 16.25) {
				var diffX = -16.25 + translateVec.x;
				var ratio = diffX / this.forceVec.x;
				var diffY = ratio * this.forceVec.y;
				reverseVec = Victor.fromArray([-diffX, -diffY]);
				this.forceVec.add(reverseVec);
				translateVec = this.cueBallVec.clone().add(this.forceVec);
			} else if (translateVec.x > 1120 - 16.25) {
				var diffX = 16.26 + (translateVec.x - 1120);
				var ratio = diffX / this.forceVec.x;
				var diffY = ratio * this.forceVec.y;
				reverseVec = Victor.fromArray([-diffX, -diffY]);
				this.forceVec.add(reverseVec);
				translateVec = this.cueBallVec.clone().add(this.forceVec);
			}

			if (translateVec.y < 16.25) {
				var diffY = -16.25 + translateVec.y;
				var ratio = diffY / this.forceVec.y;
				var diffX = ratio * this.forceVec.x;
				reverseVec = Victor.fromArray([-diffX, -diffY]);
				this.forceVec.add(reverseVec);
				translateVec = this.cueBallVec.clone().add(this.forceVec);
			} else if (translateVec.y > 560 - 16.25) {
				var diffY = 16.25 + (translateVec.y - 560);
				var ratio = diffY / this.forceVec.y;
				var diffX = ratio * this.forceVec.x;
				reverseVec = Victor.fromArray([-diffX, -diffY]);
				this.forceVec.add(reverseVec);
				translateVec = this.cueBallVec.clone().add(this.forceVec);
			}

			if (translateVec.x === 16.25 || translateVec.x === 1120 - 16.25) {
				
			}

			if (translateVec.y === 16.25 || translateVec.y === 560 - 16.25) {
				
			}

			cueballNodes[0].cx = translateVec.x;
			cueballNodes[0].cy = translateVec.y;
			
			//SetForce(gameSVG, gameballNodes);

			//translate
			cueBall.translate(cueballNodes, () => {
				//update cueBall position
				//this.cueBallVec = Victor.fromArray(cueBall.getPosition());
				// if (Vmax > 0) {
				// 	move();
				// } else {
				// 	return;
				// }
				console.log('done')
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