
var Proof = require('../').Proof,
	assert = require('assert');

describe('Proof', function() {
	describe('#constructor()', function() {
		it("should return an instance of Proof", function() {
			var fx = function(x) {return !!x;}
			assert.ok(new Proof(fx) instanceof Proof);
			assert.ok(Proof(fx) instanceof Proof);
		});
		it("should not require the `new` keyword", function() {
			var fx = function(x) {return !!x;}
			assert.ok(new Proof(fx) instanceof Proof);
			assert.ok(Proof(fx) instanceof Proof);
		});
		it("should set .fx to the provided function", function() {
			var fx = function(x) {return !!x;},
				pf = Proof(fx);
			assert.equal(fx, pf.fx);
		});
	});
	describe('#confirms()', function() {
		it('should return true if fx returns true for x', function() {
			var p = Proof(function(x) {return x === 'x';});
			assert.ok(p.confirms('x'));
		});
		it('should return false if fx returns false for x', function() {
			var p = Proof(function(x) {return x === 'x';});
			assert.ok(!p.confirms('y'));
		});
	});
	describe('#confirmsAll()', function() {
		it("should return true if fx returns true for all x's", function() {
			var p = Proof(function(x) {return typeof x === 'number';});
			assert.ok(p.confirmsAll([0,1,2,3,4,5,6,7,8,9]));
		});
		it("should return false if fx does not return true for all x's", function() {
			var p = Proof(function(x) {return typeof x === 'number';});
			assert.ok(!p.confirmsAll([0,1,2,3,4,5,6,7,8,9, "Kevin Spacey"]));
		});
		it("should return true for an empty Array", function() {
			var p = Proof(function(x) {return typeof x === 'number';});
			assert.ok(p.confirmsAll([]));
		});
	});
	describe('#confirmsAllExcept()', function() {
		it('should return only elements that return false', function() {
			var proof = Proof(function(x) {
					return typeof x === 'number';
				}),
				ins = [1, "two", 3, "four"],
				outs = ["two", "four"];
			assert.deepEqual(outs, proof.confirmsAllExcept(ins));
		});
		it('should return an Array', function() {
			var proof = Proof(function(x) {
				return typeof x === 'number';
			});
			assert.ok(Array.isArray(proof.confirmsAllExcept([])));
			assert.ok(Array.isArray(proof.confirmsAllExcept([0,2])));
			assert.ok(Array.isArray(proof.confirmsAllExcept(["0","2",4])));
		});
	});
	describe('#testArray()', function() {
		it("should match x's that return true in the return Array with true", function() {
			var isNum = function(x) {
					return typeof x === 'number';
				},
				proof = Proof(isNum),
				array = [0,1,2,3,"four","five","six"],
				results = proof.testArray(array);
			results.forEach(function(x, index) {
				assert.equal(isNum(array[index]), x);
			});
		});
		it("should match x's that return false in the return Array with false", function() {
			var isNum = function(x) {
					return typeof x === 'number';
				},
				proof = Proof(isNum),
				array = [0,1,2,3,"four","five","six"],
				results = proof.testArray(array);
			results.forEach(function(x, index) {
				assert.equal(isNum(array[index]), x);
			});
		});
		it("should return an Array of Booleans", function() {
			var proof = Proof(function(x) {
					return typeof x === 'number';
				}),
				array = [0,1,2,3,"four","five","six"],
				results = proof.testArray(array);
			results.forEach(function(x) {
				assert.equal('boolean', typeof x);
			});
		});
		it("should return an Array with a length equal to the Array provided", function() {
			var proof = Proof(function(x) {
					return typeof x === 'number';
				}),
				array = [0,1,2,3,"four","five","six"],
				results = proof.testArray(array);
			assert.equal(array.length, results.length);
		});
	});
	describe('#toString()', function() {
		it('should return [object Proof]', function() {
			var p = Proof(function(x) {return x === 'x';});
			assert.equal("[object Proof]", p.toString());
		});
	});
});