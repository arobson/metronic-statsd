## metronic statsd
A statsd adapter for the metronic metrics library (uses the lynx library).

## Use

```javascript
var metronic = require( 'metronic' )();
// default values shown
var statsd = require( 'metronic-statsd' )(
	{
		server: 'localhost'
		port: 8125
	}
);
metronic.use( statsd );
```

## Config
The only optional thing you can add to the config at the moment is an `apiPrefix` property which allows you to use this library in conjunction with hostedgraphite's StatsD collector.

```javascript
var metronic = require( 'metronic' )();
// default values shown
var statsd = require( 'metronic-statsd' )(
	{
		server: 'localhost'
		port: 8125,
		apiPrefix: "myprefix"
	}
);
metronic.use( statsd );
```
