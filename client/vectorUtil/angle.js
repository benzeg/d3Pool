const assert = require('assert');

function getTheta( r ) {
    const quadrant = [
        Math.PI*0.5,
        Math.PI,
        Math.PI*1.5,
        Math.PI*2
    ];
    
    const theta = normalize( r );

    if( !(theta > quadrant[0]) ) {
        return theta;
    } else if( !(theta > quadrant[1]) ) {
        return Math.PI - theta;
    } else if( !(theta > quadrant[2]) ) {
        return theta - Math.PI; 
    } else {
        return Math.PI*2 - theta;
    }

}

function normalize(r){ 
    let theta = r;
    if( Math.abs(r) > Math.PI*2 ) {
        theta = theta%(Math.PI*2);
    }
    if( isNegative( r )) {
        theta += Math.PI*2;
    }    
    return theta;
};

function isNegative(n){ 
    return n < 0
};

function testFn() {
    assert(
        Math.abs( getTheta( -Math.PI*2 - Math.PI*0.5 - 1 ) - ( Math.PI*1.5 - 1 ) < Math.PI/360 ),
        "Should return the theta value given a radian value which may be negative and/or contains multiple full angular rotations, while keeping its inaccuracy no greater than 0.5 of an anglular degree." );
}

testFn();
module.exports = {
    getTheta: getTheta
};