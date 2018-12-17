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

function getTheta_test() {
    assert(
        Math.abs( getTheta( -Math.PI*2 - Math.PI*0.5 - 1 ) - ( Math.PI*1.5 - 1 ) < Math.PI/360 ),
        "Should return the theta value given a radian value which may be negative and/or contains multiple full angular rotations, while keeping its inaccuracy no greater than 0.5 of an anglular degree." );
}

getTheta_test();

function getDirection(r){
    const quadrant = [
        Math.PI*0.5,
        Math.PI,
        Math.PI*1.5,
        Math.PI*2
    ];
    
    const theta = normalize( r );

    if( !(theta > quadrant[0]) ) {
       if(quadrant[0] - theta === 0){
           return [0, 1];
       }
       return [1, 1]; 
    } else if( !(theta > quadrant[1]) ) {
        if(quadrant[1] - theta === 0){
            return [-1, 0];
        }
        return [-1, 1];
    } else if( !(theta > quadrant[2]) ) {
        if(quadrant[2] - theta === 0){
            return [0, -1];
        }
        return [-1, -1]; 
    } else {
        if(theta === 0 || quadrant[3] - theta === 0){
            return [0, 0];
        }
        return [1, -1];
    }
}

function getDirection_test(){
    assert.deepStrictEqual(
        getDirection( -Math.PI*2 - Math.PI*0.5 - 1 ),
        [-1, -1],
        "Should return the correct quadrant given a radian value which may be negative and/or contains multiple full angular rotations."
    )
}

getDirection_test();

module.exports = {
    getTheta: getTheta,
    getDirection: getDirection
};