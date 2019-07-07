const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	resolve: {
		extensions: ['.tsx', '.ts', 'jsx', '.js'],
		plugins: [
			new TsconfigPathsPlugin()
		]
	},
	output: {
		path: path.resolve(__dirname, '..', 'public/static'),
		publicPath: '/static/'
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_classnames: true,
					keep_fnames: true,
					mangle: false,
				}
			})
		]
	}
};