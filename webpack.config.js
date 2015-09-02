var webpack = require('webpack');

var plugins = [new webpack.optimize.UglifyJsPlugin({ minimize: true })];

plugins.push(
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)
		}
	})
);

module.exports = {
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	entry: './client.js',
	output: {
		path: './build/js',
		publicPath: '/public/js/',
		filename: '[name].min.js'
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