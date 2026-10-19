const assert = require('assert');
const { newestFirst } = require('../www/store.js');

const list = [{ id: 'a', t: 1 }, { id: 'c', t: 3 }, { id: 'b', t: 2 }];
const sorted = newestFirst(list);
assert.deepStrictEqual(sorted.map(r => r.id), ['c', 'b', 'a'], 'newest first');
assert.deepStrictEqual(list.map(r => r.id), ['a', 'c', 'b'], 'input is not mutated');
assert.deepStrictEqual(newestFirst([]), [], 'empty list');
console.log('store ok');
