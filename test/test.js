var expect = require('chai').expect;
var rbp = require('../build/Release/rectangle_bin_pack');

describe('rectangleBinPack', function () {
	
	describe('simple calls', function() {
		
		it('simple call', function (done) {
			rbp.solve({}, [{w:64, h:64}], function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.an('array').with.lengthOf(1);
				expect(res).to.deep.equal([{x:0, y:0}]);
				done();
			});
		});
		
		it('two rectangles', function (done) {
			rbp.solve({}, [{w:32, h:32}, {w:64, h:64}], function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.an('array').with.lengthOf(2);
				expect(res).to.deep.equal([{x:0, y:64}, {x:0, y:0}]);
				done();
			});
		});
		
		it('simple call sync', function () {
			var a = [{w:64, h:64}];
			var result = rbp.solveSync({}, a);
			expect(result).to.be.ok;
			expect(a).to.be.an('array').with.lengthOf(1);
			expect(a).to.deep.equal([{x:0, y:0, w:64, h:64}]);
		});
		
		it('two rectangles sync', function () {
			var a = [{w:32, h:32}, {w:64, h:64}];
			var result = rbp.solveSync({}, a);
			expect(result).to.be.ok;
			expect(a).to.be.an('array').with.lengthOf(2);
			expect(a).to.deep.equal([{x:0, y:0, w:32, h:32}, {x:0, y:64, w:64, h:64}]);
		});		
	
	});
	
	describe('exceptions', function() {
		it('not enough arguments', function () {
			expect(rbp.solve.bind(null)).to.throw('not enough arguments');
			expect(rbp.solve.bind(null, {})).to.throw('not enough arguments');
			expect(rbp.solve.bind(null, {}, [])).to.throw('not enough arguments');
			expect(rbp.solve.bind(null, {}, [], null)).not.to.throw('not enough arguments');
		});
		

		it('first argument is not an object', function () {
			expect(rbp.solve.bind(null, true, [], null)).to.throw('first argument is not an object');
			expect(rbp.solve.bind(null, 42, [], null)).to.throw('first argument is not an object');
			expect(rbp.solve.bind(null, [], [], null)).to.throw('first argument is not an object');
			expect(rbp.solve.bind(null, {}, [], null)).not.to.throw('first argument is not an object');
		});

		it('second argument is not an array', function () {
			expect(rbp.solve.bind(null, {}, true, null)).to.throw('second argument is not an array');
			expect(rbp.solve.bind(null, {}, 42, null)).to.throw('second argument is not an array');
			expect(rbp.solve.bind(null, {}, {}, null)).to.throw('second argument is not an array');
			expect(rbp.solve.bind(null, {}, [], null)).not.to.throw('second argument is not an array');
		});
		
		it('third argument is not a function', function () {
			expect(rbp.solve.bind(null, {}, [], null)).to.throw('third argument is not a function');
			expect(rbp.solve.bind(null, {}, [], true)).to.throw('third argument is not a function');
			expect(rbp.solve.bind(null, {}, [], 42)).to.throw('third argument is not a function');
			expect(rbp.solve.bind(null, {}, [], [])).to.throw('third argument is not a function');
		});		
	});
	
	describe('exceptions sync', function() {
		it('not enough arguments', function () {
			expect(rbp.solveSync.bind(null)).to.throw('not enough arguments');
			expect(rbp.solveSync.bind(null, {})).to.throw('not enough arguments');
			expect(rbp.solveSync.bind(null, {}, [])).not.throw('not enough arguments');
		});
		
		it('first argument is not an object', function () {
			expect(rbp.solveSync.bind(null, true, [])).to.throw('first argument is not an object');
			expect(rbp.solveSync.bind(null, 42, [])).to.throw('first argument is not an object');
			expect(rbp.solveSync.bind(null, [], [])).to.throw('first argument is not an object');
			expect(rbp.solveSync.bind(null, {}, [])).not.to.throw('first argument is not an object');
		});
		
		it('second argument is not an array', function () {
			expect(rbp.solveSync.bind(null, {}, true)).to.throw('second argument is not an array');
			expect(rbp.solveSync.bind(null, {}, 42)).to.throw('second argument is not an array');
			expect(rbp.solveSync.bind(null, {}, {})).to.throw('second argument is not an array');
			expect(rbp.solveSync.bind(null, {}, [])).not.to.throw('second argument is not an array');
		});
	});	
});
