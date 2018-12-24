const Victor = require('victor');

export default class CueModel {
    constructor(container) {
        this.offsetX = -420;
        this.width = 400;
        this.offsetY = -4;
        this.height = 8;
        this.container = container;
        this.model;
        this.cueBallPosition = {
            x: 320,
            y: 320
        }
        this.rx = 10;
        this.ry = 10;
        this.rotate = true;
	this.currentRotation = 0;
        this.maxMagnitude = 240;
        this.currentMagnitude = 0;
        this.mousePosition;
        this.run = true;
    }

    setUp() {
        this.model = this.container.append("svg:g")
		.attr("transform", `rotate(${this.currentRotation}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y}) translate(-${this.currentMagnitude}) `);

	this.cueStick = this.model.append("svg:rect")
            .attr("x", this.cueBallPosition.x + this.offsetX )
            .attr("y", this.cueBallPosition.y + this.offsetY )
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill", "#000")
            .attr("rx", this.rx)
            .attr("ry", this.ry);

	//this.powerHandle = this.model.append("svg:rect")
	//	.attr("x", this.cueBallPosition.x + this.offsetX*0.25)
	//	.attr("y", this.cueBallPosition.y + this.offsetY*3.0)
	//	.attr("width", this.width - Math.abs(this.offsetX)*.90)
	//	.attr("height", Math.abs(this.offsetY)*6.0 + this.height) 
	//	.attr("fill", "#660000")
	//	.attr("rx", this.rx)
	//	.attr("ry", this.ry)

    }

    updateRotation = ( deg ) => {
	this.currentRotation = deg;
        if(this.rotate) {
            this.model.attr("transform", `rotate(${this.currentRotation}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y}) translate(-${this.currentMagnitude})`);
        }
    }

    setMousePosition = (coordinates) => {
        this.mousePosition = coordinates;
    }

    startAnimation = () => {
        if(this.run) {
            this.rotate = false;
            if(!this.move) {
                this.move = true;
            }
        }
    }

    increaseMagnitude = () => {
        if(this.move) {
            if(this.currentMagnitude < this.maxMagnitude) {
                this.currentMagnitude+=2;
                this.model
.attr("transform", `rotate(${this.currentRotation}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y}) translate(-${this.currentMagnitude})`);
                this.frameId = window.requestAnimationFrame( this.increaseMagnitude );
            } else {
                window.cancelAnimationFrame( this.frameId );
            }
        }
    }

    resetMagnitude = () => {
        if(this.currentMagnitude > 20) {
            this.currentMagnitude -= Math.min(20, this.currentMagnitude);
	    this.model
		    .attr("transform", `rotate(${this.currentRotation}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y}) translate(-${this.currentMagnitude})`);
            this.frameId = window.requestAnimationFrame( this.resetMagnitude );
        } else {
            this.currentMagnitude = 0;
            window.cancelAnimationFrame( this.frameId );
        }
    }

    stopAnimation = () => {
        this.move = false;
    }

    attachBall = ( position ) => {
        this.cueBallPosition = position;
        this.cueStick
            .attr("x", this.cueBallPosition.x + this.offsetX - this.currentMagnitude )
            .attr("y", this.cueBallPosition.y + this.offsetY );
	//this.powerHandle
	//	.attr("x", this.cueBallPosition.x + this.offsetX*0.25)
	//	.attr("y", this.cueBallPosition.y + this.offsetY*1.5)
    }

    pause = () => {
        this.run = false;
    }

    resume = () => {
        this.rotate = true;
        this.run = true;
    }

}
