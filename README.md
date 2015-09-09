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

## Types of Metrics
StatsD does _not_ treat all metrics equally. By default, this adapter will publish everything as a count unless the type is set as `time`. To change this, set a flag on the metric object itself when creating it to specify a different type. Here's the list of properties to set to true - please note: they are mutually exclusive:

 * `guage`
 * `set`
 * `increment` - value is ignored
 * `decrement` - value is ignored

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
