var webpack = require('webpack');

module.exports = {
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	entry: './client.js',
	output: {
		path: './build/js',
		publicPath: '/public/js/',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.(js|jsx)$/, exclude: /node_modules/, loader: require.resolve('babel-loader') },
			{ test: /\.json$/, loader: 'json-loader'}
		]
	},
	stats: {
		colors: true
	},
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	},
	devtool: 'source-map',
	watch: false,
	keepalive: false
};