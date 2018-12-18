const d3 = require('d3');
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
        this.maxMagnitude = 240;
        this.currentMagnitude = 0;
        this.mousePosition;
        this.run = true;
    }

    setUp() {
        this.model = this.container.append("svg:rect")
            .attr("x", this.cueBallPosition.x + this.offsetX )
            .attr("y", this.cueBallPosition.y + this.offsetY )
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill", "#000")
            .attr("rx", this.rx)
            .attr("ry", this.ry)
            .attr("transform", `rotate(${0}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y})`)
    }

    updateRotation = ( deg ) => {
        if(this.rotate) {
            this.model.attr("transform", `rotate(${deg}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y})`);
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
                .attr("x", this.cueBallPosition.x + this.offsetX - this.currentMagnitude );
                this.frameId = window.requestAnimationFrame( this.increaseMagnitude )
            } else {
                window.cancelAnimationFrame( this.frameId );
            }
        }
    }

    resetMagnitude = () => {
        if(this.currentMagnitude > 0) {
            this.currentMagnitude -= 20;
            this.model
            .attr("x", this.cueBallPosition.x + this.offsetX - this.currentMagnitude )
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
        this.model
            .attr("x", this.cueBallPosition.x + this.offsetX - this.currentMagnitude )
            .attr("y", this.cueBallPosition.y + this.offsetY );
    }

    pause = () => {
        this.run = false;
    }

    resume = () => {
        this.rotate = true;
        this.run = true;
    }

}