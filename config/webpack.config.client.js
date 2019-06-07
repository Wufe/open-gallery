const merge = require('webpack-merge');
const base = require('./webpack.config.base');
const { resolve, join } = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (target, hmr = false) => {
	return merge(base, {
	target,
	devtool: 'source-map',
	entry: {
		main: [
			...(target === 'web' && hmr ? ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&noInfo=true'] : []),
			`./client/entry-${target}.tsx`
		]
	},
	output: {
		path: resolve('./public/static', target),
		publicPath: `/static/${target}/`,
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js',
		libraryTarget: target === 'node' ? 'commonjs2' : 'umd'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: target === 'web'
						}
					},
					'css-loader']
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: target === 'web'
						}
					},
					{ loader: 'css-loader' },
					{ loader: 'sass-loader' }
				]
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader'
					}
				]
			}
		],
	},
	externals: target === 'node' ? ['@loadable/components', nodeExternals()] : undefined,
	plugins: [
		new LoadablePlugin({ filename: join('..', '..', '..', 'dist', `${target}-stats.json`) }),
		
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].chunk.css'
		})
	].concat(target === 'web' && hmr ? [
		new webpack.HotModuleReplacementPlugin()
	] : [])
})
};