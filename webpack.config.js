const client = require('./config/webpack.config.client');
const server = require('./config/webpack.config.server');

module.exports = [client('web'), client('node'), server];

module.exports.client = client;
module.exports.server = server;