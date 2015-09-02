var webpack = require('webpack');
var constants = require('./constants');

var plugins = [];

plugins.push(
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)
		}
	})
);

var filename = '[name].min.js';
if (constants.isDevelopment) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
	filename = '[name].js';
}

module.exports = {
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	entry: './client.js',
	output: {
		path: './build/js',
		publicPath: '/public/js/',
		filename: filename
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.(js|jsx)$/, exclude: /node_modules/, loader: require.resolve('babel-loader'), query: { stage: 0 } },
			{ test: /\.json$/, loader: 'json-loader'}
		]
	},
	stats: {
		colors: true
	},
	plugins: plugins,
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	},
	devtool: 'source-map',
	watch: false,
	keepalive: false
};