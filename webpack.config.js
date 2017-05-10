var path = require('path');

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: ['./pool.js'],
	output: {
		path: path.join(__dirname, 'www'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
		{exclude: /node_modules/,
			use: [
				'babel-loader'
				],
			},
		],
	},
	resolve: {
		modules: [
			path.join(__dirname, 'node_modules')
		],
	},
};