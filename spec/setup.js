var chai = require( 'chai' );
chai.use( require( 'chai-as-promised' ) );
global.should = chai.should();
global.expect = chai.expect;
global._ = require( 'lodash' );
global.fs = require( 'fs' );
global.sinon = require( 'sinon' );
