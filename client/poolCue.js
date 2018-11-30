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
        this.move = true;
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
        if(this.move) {
            this.model.attr("transform", `rotate(${deg}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y})`);
        }
    }

    attachBall = ( position ) => {
        this.cueBallPosition = position;
        this.model
            .attr("x", this.cueBallPosition.x + this.offsetX )
            .attr("y", this.cueBallPosition.y + this.offsetY )
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill", "#000")
            .attr("rx", this.rx)
            .attr("ry", this.ry)
            .attr("transform", `rotate(${0}, ${this.cueBallPosition.x}, ${this.cueBallPosition.y})`);
    }

    pause = () => {
        this.move = false;
    }

    resume = () => {
        this.move = true;
    }

}