/*Dependencies*/
const Victor = require('victor');
/////////////////////////////////////////////////////////////////////////////

const scalarToVec = (scalar, vector) => {
	let z = Math.sqrt(Math.pow(scalar, 2) / (Math.pow(vector.x, 2) + Math.pow(vector.y, 2)));
	return new Victor.fromArray([vector.x * z, vector.y * z]);
}

module.exports = {
	scalarToVec: scalarToVec
}