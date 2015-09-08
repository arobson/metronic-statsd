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
			var key = data.key;
			if( config.apiPrefix ) {
				key = [ config.apiPrefix, key ].join( '.' );
			}
			switch( data.type ) {
				case 'time':
					client.timing( key, data.value, sampling );
					break;
				default:
					client.count( key, data.value, sampling );
			}
		},
		setConverter: function( converter ) {
			convert = converter;
		}
	};
};
