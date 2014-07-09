
var Seth = require('../'),
	Set = Seth.Set,
	Proof = Seth.Proof,
	assert = require('assert');

describe("Set", function() {
	// constructor
	describe("#constructor()", function() {
		it("should return an instance of Set", function() {
			assert.ok(new Set([1,2,3]) instanceof Set);
			assert.ok(Set([1,2,3]) instanceof Set);
		});
		it("should not require the `new` keyword", function() {
			assert.ok(new Set([1,2,3]) instanceof Set);
			assert.ok(Set([1,2,3]) instanceof Set);
		});
		it("should use universe Everything if one is not provided", function() {
			assert.equal(Seth.Everything, Set([1,2,3]).universe);
		});
	});
	describe("#setUniverse()", function() {
		it("should assign the given universe to .universe", function() {
			var A = Set([0,1,2]),
				B = Seth.Integers;
			assert.equal(Seth.Everything, A.universe);
			A.setUniverse(B);
			assert.equal(Seth.Integers, A.universe);
		});
		it("should construct a new Set provided an Array", function() {
			var A = Set([0,1,2]),
				bs = [0,1,2,3];
			assert.equal(Seth.Everything, A.universe);
			A.setUniverse(bs);
			assert.equal(bs, A.universe._members);
		});
		it("should return Set for chaining", function() {
			var A = Set([0,1,2]);
			assert.equal(A, A.setUniverse(Seth.Nothing));
		});
	});
	describe("#setMembers()", function() {
		it("should assign the given members() to #hasMember()", function() {
			var even = function(x) {return x % 2 === 0;},
				odd = function(x) {return x % 2 !== 0;},
				A = Set(even);
			assert.equal(true, A.hasMember(2) && A.hasMember(4));
			A.setMembers(odd);
			assert.equal(false, A.hasMember(2) && A.hasMember(4));
		});
		it("should construct #hasMember provided an Array", function() {
			var A = Set([0,1,2]).setMembers([0,2,4]);
			assert.ok(A.hasMember(0) && A.hasMember(2) && A.hasMember(4));
			assert.ok(!(A.hasMember(1) || A.hasMember(3) || A.hasMember(5)));
		});
		it("should return Set for chaining", function() {
			var A = Set([0,1,2]);
			assert.equal(A, A.setMembers([]));
		});
	});
	// operations
	describe("#contains()", function() {
		it("should return true if the element is in the set", function() {
			var A = Set([0,2,4]);
			assert.ok(A.hasMember(0) && A.hasMember(2) && A.hasMember(4));
		});
		it("should return false is the element is not in the set", function() {
			var A = Set([0,2,4]);
			assert.ok(!(A.hasMember(1) || A.hasMember(3) || A.hasMember(5)));
		});
		it("should use #isSupersetOf() if provided a Set", function(done) {
			var A = Set([0,2,4]),
				B = Set([1,3,5]);
			A.isSupersetOf = function(b) {
				assert.equal(B, b);
				done();
			}
			A.contains(B);
		});
	});
	describe("#union()", function() {
		returnSet(it, 'union', function(ab, ba) {
			it('should contain all the elements of A and B', function() {
				var pa = Proof(ab.contains.bind(ab)),
					pb = Proof(ba.contains.bind(ba)),
					arrayIn = [0,1,2,3,4,5,6,7,8,9],
					t = true, f = false,
					arrayOut = [f,t,t,t,t,t,f,t,f,t];
				assert.deepEqual(arrayOut, pa.testArray(arrayIn));
				assert.deepEqual(arrayOut, pb.testArray(arrayIn));
			});
		});
	});
	describe("#intersect()", function() {
		returnSet(it, 'intersect', function(ab, ba) {
			it('should contain all the elements of both A and B', function() {
				var pa = Proof(ab.contains.bind(ab)),
					pb = Proof(ba.contains.bind(ba)),
					arrayIn = [0,1,2,3,4,5,6,7,8,9],
					t = true, f = false,
					arrayOut = [f,t,f,t,f,t,f,f,f,f];
				assert.deepEqual(arrayOut, pa.testArray(arrayIn));
				assert.deepEqual(arrayOut, pb.testArray(arrayIn));
			});
		});
	});
	describe("#difference()", function() {
		returnSet(it, 'difference', function(ab, ba) {
			it('should contain all the elements of A but not B', function() {
				var pa = Proof(ab.contains.bind(ab)),
					pb = Proof(ba.contains.bind(ba)),
					arrayIn = 		[0,1,2,3,4,5,6,7,8,9],
					t = true, f = false,
					arrayOutAB = 	[f,f,t,f,t,f,f,f,f,f],
					arrayOutBA = 	[f,f,f,f,f,f,f,t,f,t];
				assert.deepEqual(arrayOutAB, pa.testArray(arrayIn));
				assert.deepEqual(arrayOutBA, pb.testArray(arrayIn));
			});
		});
	});
	describe("#symmetricDifference()", function() {
		returnSet(it, 'symmetricDifference', function(ab, ba) {
			it('should contain all the elements of A or B but not both', function() {
				var pa = Proof(ab.contains.bind(ab)),
					pb = Proof(ba.contains.bind(ba)),
					arrayIn = 	[0,1,2,3,4,5,6,7,8,9],
					t = true, f = false,
					arrayOut = 	[f,f,t,f,t,f,f,t,f,t];
				assert.deepEqual(arrayOut, pa.testArray(arrayIn));
				assert.deepEqual(arrayOut, pb.testArray(arrayIn));
			});
		});
	});
	describe("#cartesianProduct()", function() {
		returnSet(it, 'cartesianProduct', function(ab, ba) {
			it('should contain all element combinations of [A * B]', function() {
				var pa = Proof(ab.contains.bind(ab)),
					pb = Proof(ba.contains.bind(ba)),
					arrayIn = 	[[0,1],[2,3],[4,5],[6,7],[8,9]],
					t = true, f = false,
					arrayOut = [f,t,t,f,f];
				assert.deepEqual(arrayOut, pa.testArray(arrayIn));
				assert.deepEqual(arrayOut, pb.testArray(arrayIn));
			});
		});
	});
	describe("#complement()", function() {
		returnSet(it, 'complement', function(ac, bc) {
			it('should contain all elements in U but not A', function() {
				var pa = Proof(ac.contains.bind(ac)),
					pb = Proof(bc.contains.bind(bc)),
					arrayIn = 		[0,1,2,3,4,5,6,7,8,9],
					t = true, f = false,
					arrayOutAC = 	[t,f,f,f,f,f,t,t,t,t],
					arrayOutBC = 	[t,f,t,f,t,f,t,f,t,f];
				assert.deepEqual(arrayOutAC, pa.testArray(arrayIn));
				assert.deepEqual(arrayOutBC, pb.testArray(arrayIn));
			});
		});
	});
	describe("#inverse()", function() {
		returnSet(it, 'inverse', function(ai, bi) {
			it('should contain all elements not in A', function() {
				var pa = Proof(ai.contains.bind(ai)),
					pb = Proof(bi.contains.bind(bi)),
					arrayIn = 		[0,1,2,3,4,5,6,7,8,9],
					t = true, f = false,
					arrayOutAI = 	[t,f,f,f,f,f,t,t,t,t],
					arrayOutBI = 	[t,f,t,f,t,f,t,f,t,f];
				assert.deepEqual(arrayOutAI, pa.testArray(arrayIn));
				assert.deepEqual(arrayOutBI, pb.testArray(arrayIn));
			});
		});
	});

	function returnSet(it, method, description) {
		var A = Set([1,2,3,4,5]),
			B = Set([1,3,5,7,9]),
			AB = A[method](B),
			BA = B[method](A);
		it('should return a new Set', function() {
			assert.ok(AB instanceof Set);
			assert.ok(BA instanceof Set);
		});
		if(!description) return;
		describe('Return Set', description.bind(null, AB, BA));
	}

	// comparisons
	describe("#isSupersetOf()", function() {
		returnProof(it, 'isSupersetOf', function(proof) {
			var f = proof.confirms.bind(proof);
			it('should return true if x is in A and B', function() {
				assert.ok(f(1) && f(2) && f(4));
			});
			it('should return false if x is not in A and/or B', function() {
				assert.ok(!(f(6) || f(5) || f(3)));
			});
		});
	});
	describe("#isSubsetOf()", function() {
		returnProof(it, 'isSubsetOf', function(proof) {
			var f = proof.confirms.bind(proof);
			it('should return true if x is in A and B', function() {
				assert.ok(f(1) && f(2) && f(4));
			});
			it('should return false if x is not in A and/or B', function() {
				assert.ok(!(f(6) || f(5) || f(3)));
			});
		});
	});
	describe("#isProperSubsetOf()", function() {
		returnProof(it, 'isProperSubsetOf', function(proof) {
			var f = proof.confirms.bind(proof);
			it('should return true if x is in (A ∩ B) but not in (B ∩ A)', function() {
				// Since A is not a subset of B, there are no true returns.
			});
			it('should return false if x is in (A ∩ B) and in (B ∩ A)', function() {
				assert.ok(!(f(0) || f(1) || f(2) || f(4)));
			});
		});
	});
	describe("#isComplementOf()", function() {
		returnProof(it, 'isComplementOf', function(proof) {
			var f = proof.confirms.bind(proof);
			it('should return true if x is in U and in A or B but not both', function() {
				assert.ok(f(3) && f(5));
			});
			it('should return false if x is in U and not in A or B or A and B', function() {
				assert.ok(!(f(0) || f(1) || f(2)));
			});
		});
	});
	describe("#isInverseOf()", function() {
		returnProof(it, 'isInverseOf', function(proof) {
			var f = proof.confirms.bind(proof);
			it('should return true if x is in A or B but not both', function() {
				assert.ok(f(3) && f(5));
			});
			it('should return false if x is not in A or B or A and B', function() {
				assert.ok(!(f(0) || f(1) || f(2)));
			});
		});
	});

	function returnProof(it, method, description) {
		var A = Set([1,2,3,4,5]),
			B = Set([1,2,4]),
			f = A[method](B),
			g = A[method](B, 0),
			h = A[method](B, [1,2]);
		it("should return a new Proof if not provided a confirmation", function() {
			assert.ok(f instanceof Proof);
		});
		it("should return a Boolean provided a confirmation", function() {
			assert.equal('boolean', typeof g);
			assert.equal('boolean', typeof h);
		});
		if(!description) return;
		describe("Return Proof", description.bind(null, f));
	}

	// utilities
	describe("#subset()", function() {
		it("should return a new Set with this as its universe", function() {
			var A = Set([1,2,3]),
				B = A.subset([2]);
			assert.equal(A, B.universe);
		});
	});
	describe("#toString()", function() {
		it('should return [object Set]', function() {
			assert.equal("[object Set]", Set([]).toString());
		});
	});
	describe("#toDebugString()", function(done) {
		it('should use #toString() if an Array is not supplied', function(done) {
			var A = Set(function(x) {return x + 2 > 4; });
			A.toString = function() {
				done();
			}
			assert.equal("[object Set]", Set(function(x) {}).toDebugString());
			A.toDebugString();
		});
		it('should return [object Set([a,b,c..])] supplied an Array', function() {
			assert.equal("[object Set([1,2,3])]", Set([1,2,3]).toDebugString());
			assert.equal('[object Set([0,2,"4"])]', Set([0,2,"4"]).toDebugString());
		});
	});
});
