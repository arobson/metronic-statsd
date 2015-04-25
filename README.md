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
