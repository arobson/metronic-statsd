var convert;
var statsd = require( 'lynx' );

module.exports = function( config ) {
	var server = 'localhost';
	var port = 8125;
	var sampling;
	if ( config ) {
		server = config.server || server;
		port = config.port || port;
		sampling = config.sampling;
	}
	var client = statsd( server, port );
	return {
		onMetric: function( data ) {
			if ( data.type === 'time' ) {
				data.value = convert( data.value, data.units, 'ms' );
			}
			client.count( data.key, data.value, sampling );
		},
		setConverter: function( converter ) {
			convert = converter;
		}
	};
};
