require( '../setup' );

var clientMock = {
	scope: undefined,
	metrics: [],
	reset: function() {
		this.scope = undefined;
		this.metrics = [];
	},
	timing: function( key, value, sampling ) {
		this.metrics.push( { key: key, value: value, sampling: sampling, timing: true } );
	},
	count: function( key, value, sampling ) {
		this.metrics.push( { key: key, value: value, sampling: sampling, count: true } );
	},
	decrement: function( key, sampling ) {
		this.metrics.push( { key: key, sampling: sampling, decrement: true } );
	},
	gauge: function( key, value, sampling ) {
		this.metrics.push( { key: key, value: value, sampling: sampling, gauge: true } );
	},
	increment: function( key, sampling ) {
		this.metrics.push( { key: key, sampling: sampling, increment: true } );
	},
	set: function( key, value, sampling ) {
		this.metrics.push( { key: key, value: value, sampling: sampling, set: true } );
	}
};

var fn = proxyquire( '../src/index', {
	lynx: function( url, port, opts ) {
		if ( opts.scope ) {
			clientMock.scope = opts.scope;
		}
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
			adapter.onMetric( {
				type: 'gauge',
				key: 'aGuage',
				value: 10,
				units: '',
				timestamp: stamp
			} );
		} );

		it( 'should capture correct measures', function() {
			clientMock.metrics.should.eql( [
				{ key: 'duration', value: 1000, sampling: undefined, timing: true },
				{ key: 'meter', value: 1, sampling: undefined, count: true },
				{ key: 'aGuage', value: 10, sampling: undefined, gauge: true }
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
			adapter.onMetric( {
				type: 'meter',
				key: 'aSet',
				value: 5,
				units: '',
				timestamp: stamp,
				set: true
			} );
		} );

		it( 'should capture correct measures', function() {
			clientMock.metrics.should.eql( [
				{ key: 'duration', value: 1000, sampling: undefined, timing: true },
				{ key: 'meter', value: 1, sampling: undefined, count: true },
				{ key: 'aSet', value: 5, sampling: undefined, set: true }
			] );
		} );

		after( function() {
			clientMock.reset();
		} );
	} );

	describe( 'with sampling', function() {
		var adapter, stamp;
		before( function() {
			adapter = fn( { sampling: 0.1, apiPrefix: 'test-key' } );
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
			adapter.onMetric( {
				type: 'increment',
				key: 'incr',
				value: 20,
				units: '',
				timestamp: stamp
			} );
			adapter.onMetric( {
				type: 'meter',
				key: 'decr',
				value: 20,
				units: '',
				timestamp: stamp,
				decrement: true
			} );
		} );

		it( 'should set scope on client', function() {
			clientMock.scope.should.eql( 'test-key' );
		} );

		it( 'should capture correct measures', function() {
			clientMock.metrics.should.eql( [
				{ key: 'duration', value: 1, sampling: 0.1, timing: true },
				{ key: 'meter', value: 1, sampling: 0.1, count: true },
				{ key: 'incr', sampling: 0.1, increment: true },
				{ key: 'decr', sampling: 0.1, decrement: true },
			] );
		} );

		after( function() {
			clientMock.reset();
		} );
	} );
} );
