const client = require('./config/webpack.config.client');
const server = require('./config/webpack.config.server');

const modules = [
	client('node'),
	client('web'),
	server('frontend'),
	server('backend'),
];

module.exports = modules;

module.exports.client = client;
module.exports.server = server;