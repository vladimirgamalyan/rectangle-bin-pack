var expect = require('chai').expect;
var rbp = require('../build/Release/rectangle_bin_pack');

var ERR_NOT_ENOUGH_ARGUMENTS = 'not enough arguments';
var ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT = 'first argument is not an object';
var ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY = 'second argument is not an array';
var ERR_THIRD_ARGUMENT_IS_NOT_A_FUNCTION = 'third argument is not a function';

var ERR_INVALID_WIDTH_OPTION_VALUE = "invalid width option value";
var ERR_INVALID_HEIGHT_OPTION_VALUE = "invalid height option value";
var ERR_INVALID_ALGORITHM_OPTION_VALUE = "invalid algorithm option value";
var ERR_EMPTY_ALGORITHM_OPTION_VALUE = "empty algorithm option value";
var ERR_UNKNOWN_ALGORITHM_OPTION_VALUE = "unknown algorithm option value";

describe('rectangleBinPack', function () {
	
	describe('simple calls', function() {
		
		it('simple call', function (done) {
			rbp.solve({w:100, h:100}, [{w:64, h:64}], function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.an('array').with.lengthOf(1);
				expect(res).to.deep.equal([{x:0, y:0}]);
				done();
			});
		});
		
		it('two rectangles', function (done) {
			rbp.solve({w:100, h:100}, [{w:32, h:32}, {w:64, h:64}], function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.an('array').with.lengthOf(2);
				expect(res).to.deep.equal([{x:0, y:64}, {x:0, y:0}]);
				done();
			});
		});
		
		it('simple call sync', function () {
			var a = [{w:64, h:64}];
			var result = rbp.solveSync({w:100, h:100}, a);
			expect(result).to.be.ok;
			expect(a).to.be.an('array').with.lengthOf(1);
			expect(a).to.deep.equal([{x:0, y:0, w:64, h:64}]);
		});
		
		it('two rectangles sync', function () {
			var a = [{w:32, h:32}, {w:64, h:64}];
			var result = rbp.solveSync({w:100, h:100}, a);
			expect(result).to.be.ok;
			expect(a).to.be.an('array').with.lengthOf(2);
			expect(a).to.deep.equal([{x:0, y:0, w:32, h:32}, {x:0, y:64, w:64, h:64}]);
		});		
	
	});
	
	describe('exceptions', function() {
		it('not enough arguments', function () {
			expect(rbp.solve.bind(null)).to.throw(ERR_NOT_ENOUGH_ARGUMENTS);
			expect(rbp.solve.bind(null, {})).to.throw(ERR_NOT_ENOUGH_ARGUMENTS);
			expect(rbp.solve.bind(null, {}, [])).to.throw(ERR_NOT_ENOUGH_ARGUMENTS);
			expect(rbp.solve.bind(null, {}, [], null)).not.to.throw(ERR_NOT_ENOUGH_ARGUMENTS);
		});
		

		it('first argument is not an object', function () {
			expect(rbp.solve.bind(null, true, [], null)).to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
			expect(rbp.solve.bind(null, 42, [], null)).to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
			expect(rbp.solve.bind(null, [], [], null)).to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
			expect(rbp.solve.bind(null, {}, [], null)).not.to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
		});

		it('second argument is not an array', function () {
			expect(rbp.solve.bind(null, {}, true, null)).to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
			expect(rbp.solve.bind(null, {}, 42, null)).to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
			expect(rbp.solve.bind(null, {}, {}, null)).to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
			expect(rbp.solve.bind(null, {}, [], null)).not.to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
		});
		
		it('third argument is not a function', function () {
			expect(rbp.solve.bind(null, {}, [], null)).to.throw(ERR_THIRD_ARGUMENT_IS_NOT_A_FUNCTION);
			expect(rbp.solve.bind(null, {}, [], true)).to.throw(ERR_THIRD_ARGUMENT_IS_NOT_A_FUNCTION);
			expect(rbp.solve.bind(null, {}, [], 42)).to.throw(ERR_THIRD_ARGUMENT_IS_NOT_A_FUNCTION);
			expect(rbp.solve.bind(null, {}, [], [])).to.throw(ERR_THIRD_ARGUMENT_IS_NOT_A_FUNCTION);
		});		
	});
	
	describe('exceptions sync', function() {
		it('not enough arguments', function () {
			expect(rbp.solveSync.bind(null)).to.throw(ERR_NOT_ENOUGH_ARGUMENTS);
			expect(rbp.solveSync.bind(null, {})).to.throw(ERR_NOT_ENOUGH_ARGUMENTS);
			expect(rbp.solveSync.bind(null, {}, [])).not.throw(ERR_NOT_ENOUGH_ARGUMENTS);
		});
		
		it('first argument is not an object', function () {
			expect(rbp.solveSync.bind(null, true, [])).to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
			expect(rbp.solveSync.bind(null, 42, [])).to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
			expect(rbp.solveSync.bind(null, [], [])).to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
			expect(rbp.solveSync.bind(null, {}, [])).not.to.throw(ERR_FIRST_ARGUMENT_IS_NOT_AN_OBJECT);
		});
		
		it('second argument is not an array', function () {
			expect(rbp.solveSync.bind(null, {}, true)).to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
			expect(rbp.solveSync.bind(null, {}, 42)).to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
			expect(rbp.solveSync.bind(null, {}, {})).to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
			expect(rbp.solveSync.bind(null, {}, [])).not.to.throw(ERR_SECOND_ARGUMENT_IS_NOT_AN_ARRAY);
		});
	});
	
	describe('options exceptions', function() {
		
		it('invalid witdh', function () {
			expect(rbp.solveSync.bind(null, {w: null, h: 42}, [])).to.throw(ERR_INVALID_WIDTH_OPTION_VALUE);
			expect(rbp.solveSync.bind(null, {w: true, h: 42}, [])).to.throw(ERR_INVALID_WIDTH_OPTION_VALUE);
			expect(rbp.solveSync.bind(null, {w: 64, h: 42}, [])).not.to.throw(ERR_INVALID_WIDTH_OPTION_VALUE);	
		});
		
		it('invalid height', function () {
			expect(rbp.solveSync.bind(null, {w: 42, h: null}, [])).to.throw(ERR_INVALID_HEIGHT_OPTION_VALUE);
			expect(rbp.solveSync.bind(null, {w: 42, h: true}, [])).to.throw(ERR_INVALID_HEIGHT_OPTION_VALUE);
			expect(rbp.solveSync.bind(null, {w: 42, h: 64}, [])).not.to.throw(ERR_INVALID_HEIGHT_OPTION_VALUE);
		});
		
		it('invalid algorithm', function () {
			expect(rbp.solveSync.bind(null, {w: 42, h: 42, alg: null}, [])).to.throw(ERR_INVALID_ALGORITHM_OPTION_VALUE);
			expect(rbp.solveSync.bind(null, {w: 42, h: 42, alg: []}, [])).to.throw(ERR_INVALID_ALGORITHM_OPTION_VALUE);
			expect(rbp.solveSync.bind(null, {w: 42, h: 42, alg: 42}, [])).to.throw(ERR_INVALID_ALGORITHM_OPTION_VALUE);
			expect(rbp.solveSync.bind(null, {w: 42, h: 42, alg: {}}, [])).to.throw(ERR_INVALID_ALGORITHM_OPTION_VALUE);
		});
		
		it('empty algorithm', function () {
			expect(rbp.solveSync.bind(null, {w: 42, h: 42, alg: ''}, [])).to.throw(ERR_EMPTY_ALGORITHM_OPTION_VALUE);
		});	

		it('unknown algorithm', function () {
			expect(rbp.solveSync.bind(null, {w: 42, h: 42, alg: 'foo'}, [])).to.throw(ERR_UNKNOWN_ALGORITHM_OPTION_VALUE);
		});	
		
	});
});
