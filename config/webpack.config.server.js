const path = require('path');
const base = require('./webpack.config.base');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');
const webpack = require('webpack');

const merge = require('webpack-merge');

module.exports = merge(base, {
	target: 'node',
	devtool: 'inline-source-map',
	entry: {
		server: path.resolve(__dirname, '..', 'presentation/index.ts')
	},
	output: {
		path: path.resolve(__dirname, '..', 'dist'),
		filename: '[name].js',
		library: 'commonjs'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'isomorphic-style-loader',
					'css-loader']
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: 'isomorphic-style-loader' },
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
						loader: 'ts-loader',
						options: {
							compilerOptions: {
								module: 'commonjs'
							}
						}
					}
				]
			}
		]
	},
	externals: nodeExternals({
		whitelist: [/\.css$/]
	}),
	node: {
		__dirname: false
	},
	plugins: []
});