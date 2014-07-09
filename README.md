Seth
====

Seth is JavaScript DSL for functional Set Theory. This DSL aims to present set theory in its abstract mathematical form instead of manually dealing with literal arrays and their elements in a programming environment.

Seth is available on both [NPM](https://www.npmjs.org/package/seth) and Bower with support for AMD and contains tiny shims to support pre-ES6.

```bash
npm install seth
bower install seth
``` 

Seth is pretty intuitive to use if already familiar with common set operations and comparisons. It looks like this, required in Node.js:

```javascript
var Seth = require('seth'),
	Set = Seth.Set;

var C = Set([1,2,3]).union(Set([1,4,5]));
//> C = Set([1,2,3,4,5]);

var Zc = Seth.Integers.complement();
// Numbers is the set of all Numbers. (U)
// Integers is the set of all Integers within the Numbers universe. (A)
// thus, Zc is the set of all Numbers that are not Integers. (U\A)

var CAndZc = C.intersect(Zc);
//> CAndZc = Set([..all Numbers that are not Integers and are in C..]);
// therefore, CAndZc is an empty set.

var proof = CAndZc.isSubsetOf(Seth.Nothing);
// Nothing is an empty set.

// Proofs allow assertions to be made more easily
proof.confirms(2) //> true
proof.confirmsAll([1,2,3,4,5]) //> true
```

## Features

Seth is a set theory DSL with universe awareness that is composed functionally. Set Operations include `union`, `intersect`, `difference`, `symmetricDifference`, `cartesianProduct`, `complement`, and `inverse`. Comparisons include `isSupersetOf`, `isSubsetOf`, `isProperSubsetOf`, `isComplementOf`, and `isInverseOf`. All comparisons return Proofs that make assertions based on sets easier to handle and reason with methods like `confirms`, `confirmsAll`, `confirmsAllExcept`, and `testArray`.

Seth includes common sets such as `Everything`, `Nothing` (alias `Empty`), `Numbers` (alias `R`), and `Integers` (alias `Z`) for convenience.

## What is Functional Set Theory?

I made it up.

Functional Set Theory is not a mathematical concept or a subset of set theory. When I say "functional set theory," what I mean is set theory composed of functions instead of definite elements in a manner similarly expressed by functional programming languages. A functional set is not a list or range of elements, but it is instead a Boolean function that states whether a given element matches a given set's criteria of containment.

Why would I use such big words to construct an imaginary concept, one that is not even mathematically sound? Performance, duh. The real theory is computationally inefficient. For example, how would a computer store a set of everything, all combinations and deviations of numbers, strings, and objects? A computer will never have enough memory to capture everything. Even the smaller set of all numbers could not be stored in the memory of a computer. Yet Seth could not be limited to simple, short-length arrays of values.

Seth needed something faster, more concise, and most importantly composable. The solution was functions and logic. Functions are awesome because they are lazy, exempt from depleting memory resources until they are evaluated. Logic is awesome because it is lightning fast and expressive. Combined they can efficiently express set theory.

Instead of writing out every possible value in the universe, a set of everything in Seth can be expressed with one simple function.

```javascript
// The exact implementation of Seth.Everything
var Everything = Set(function(x) {
	return true;	
});
```

No matter what `x` is, the function returns `true` because the set contains everything. The set of all numbers is just as easy to create.

```javascript
// Seth.Numbers
var Numbers = Set(function(x) {
	return typeof x === 'number';
});
```

These sets can then be composed into new sets with different meanings.

```javascript
var NonNumbers = Numbers.complement();
// Everything is the default universe.

// NonNumbers is equivalent to:
var NonNumber = Set(function(x) {
	return typeof x !== 'number';
});
```

That's amazing. What's more is the performance of this abstraction: in personal testing of Seth, 75 tests of the entire codebase only took 24ms. This is only the scratching surface of what is feasible with Seth. 

## Contributing

I have never taken a class on set theory (heck I'm still in high school). I did read the [Wikipedia page](http://en.wikipedia.org/wiki/Set_theory) a few dozen times. This is just an interest of mine that I saw was lacking in implementation in the open-source community at large, so I wanted to attempt to fill the gap.

If you are a professional set theorist or even an amateur like me, if there is a bug please open an issue. If there is a feature this DSL should have, more common operations or comparisons, please point me to them or be hardcore and send me the pull request.

Contributions are incredibly welcome as long as they are standardly applicable and pass the tests (or break bad ones). Tests are written in Mocha and assertions are done with the Node.js core `assert` module.

```bash
# running tests
npm run test
npm run test-spec # spec reporter
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for the lolz and please check out my other [repositories](https://github.com/andrejewski) if I have earned it. I thank you for reading.
