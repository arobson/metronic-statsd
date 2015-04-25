require( '../setup' );
var proxyquire = require( 'proxyquire' );
var clientMock = {
	metrics: [],
	reset: function() {
		this.metrics = [];
	},
	timing: function( key, value, sampling ) {
		this.metrics.push( { key: key, value: value, sampling: sampling } );
	},
	count: function( key, value, sampling ) {
		this.metrics.push( { key: key, value: value, sampling: sampling } );
	}
};

var fn = proxyquire( '../../src/index', {
	lynx: function() {
		return clientMock;
	}
} );

describe( 'Adapter', function() {
	describe( 'without configuration', function() {
		var adapter, stamp;
		before( function() {
			adapter = fn();
			adapter.setConverter( require( 'metronic/convert' ) );
			stamp = Date.now();
			adapter.onMetric( {
				type: 'time',
				key: 'duration',
				value: 1,
				units: 's',
				timestamp: stamp
			} );
			adapter.onMetric( {
				type: 'meter',
				key: 'meter',
				value: 1,
				units: '',
				timestamp: stamp
			} );
		} );

		it( 'should capture correct measures', function() {
			clientMock.metrics.should.eql( [
				{ key: 'duration', value: 1000, sampling: undefined },
				{ key: 'meter', value: 1, sampling: undefined },
			] );
		} );

		after( function() {
			clientMock.reset();
		} );
	} );

	describe( 'with missing units', function() {
		var adapter, stamp;
		before( function() {
			adapter = fn( {} );
			adapter.setConverter( require( 'metronic/convert' ) );
			stamp = Date.now();
			adapter.onMetric( {
				type: 'time',
				key: 'duration',
				value: 1000,
				units: 'ms',
				timestamp: stamp
			} );
			adapter.onMetric( {
				type: 'meter',
				key: 'meter',
				value: 1,
				units: '',
				timestamp: stamp
			} );
		} );

		it( 'should capture correct measures', function() {
			clientMock.metrics.should.eql( [
				{ key: 'duration', value: 1000, sampling: undefined },
				{ key: 'meter', value: 1, sampling: undefined },
			] );
		} );

		after( function() {
			clientMock.reset();
		} );
	} );

	describe( 'with sampling', function() {
		var adapter, stamp;
		before( function() {
			adapter = fn( { sampling: 0.1 } );
			adapter.setConverter( require( 'metronic/convert' ) );
			stamp = Date.now();
			adapter.onMetric( {
				type: 'time',
				key: 'duration',
				value: 1000,
				units: 'us',
				timestamp: stamp
			} );
			adapter.onMetric( {
				type: 'meter',
				key: 'meter',
				value: 1,
				units: '',
				timestamp: stamp
			} );
		} );

		it( 'should capture correct measures', function() {
			clientMock.metrics.should.eql( [
				{ key: 'duration', value: 1, sampling: 0.1 },
				{ key: 'meter', value: 1, sampling: 0.1 },
			] );
		} );

		after( function() {
			clientMock.reset();
		} );
	} );
} );
