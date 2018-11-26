/*Dependencies*/
import * as Victor from 'victor';

/////////////////////////////////////////////////////////////////////////////

export default function vecUtil(scalar, vector) {
	let z = Math.sqrt(Math.pow(scalar, 2) / (Math.pow(vector.x, 2) + Math.pow(vector.y, 2)));
	return new Victor.fromArray([vector.x * z, vector.y * z]);
}