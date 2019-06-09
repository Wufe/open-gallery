const client = require('./config/webpack.config.client');
const server = require('./config/webpack.config.server');

const isProd = process.env.NODE_ENV === 'production';

const modules = [
	client('node'),
	server
];

if (isProd)
	modules.push(client('web'));

module.exports = modules;

module.exports.client = client;
module.exports.server = server;