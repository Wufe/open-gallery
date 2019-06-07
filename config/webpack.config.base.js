const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	mode: 'development',
	resolve: {
		extensions: ['.tsx', '.ts', 'jsx', '.js'],
		plugins: [
			new TsconfigPathsPlugin()
		]
	},
	output: {
		path: path.resolve(__dirname, '..', 'public/static'),
		publicPath: '/static/'
	}
};