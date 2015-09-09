var convert;
var _ = require( 'lodash' );
var statsd = require( 'lynx' );
var systemGauges = [
	'SYSTEM_MEMORY_TOTAL',
	'SYSTEM_MEMORY_USED',
	'SYSTEM_MEMORY_FREE',
	'PROCESS_RESIDENT_SET',
	'PROCESS_HEAP_TOTAL',
	'PROCESS_HEAP_USED',
	'PROCESS_CORE_0_LOAD',
	'PROCESS_CORE_1_LOAD',
	'PROCESS_CORE_2_LOAD',
	'PROCESS_CORE_3_LOAD',
	'PROCESS_CORE_4_LOAD',
	'PROCESS_CORE_5_LOAD',
	'PROCESS_CORE_6_LOAD',
	'PROCESS_CORE_7_LOAD',
];

module.exports = function( config ) {
	var server = 'localhost';
	var port = 8125;
	var sampling;
	if ( config ) {
		server = config.server || server;
		port = config.port || port;
		sampling = config.sampling;
	}
	var opts = {};
	if ( config && config.apiPrefix ) {
		opts.scope = config.apiPrefix;
	}
	var client = statsd( server, port, opts );

	return {
		onMetric: function( data ) {
			if ( data.type === 'time' ) {
				data.value = convert( data.value, data.units, 'ms' );
				client.timing( data.key, data.value, sampling );
			} else if ( data.guage || data.type === 'guage' || _.contains( systemGauges, data.name ) ) {
				client.guage( data.key, data.value, sampling );
			} else if ( data.set || data.type === 'set' ) {
				client.set( data.key, data.value, sampling );
			} else if ( data.increment || data.type === 'increment' ) {
				client.increment( data.key, sampling );
			} else if ( data.decrement || data.type === 'decrement' ) {
				client.decrement( data.key, sampling );
			} else {
				client.count( data.key, data.value, sampling );
			}
		},
		setConverter: function( converter ) {
			convert = converter;
		}
	};
};
