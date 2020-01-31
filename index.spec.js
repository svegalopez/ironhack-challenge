require('mocha');
const isEqual = require('lodash').isEqual
const solve = require('./index').solve

const Test = {
    assertSimilar: function (result, expectation) {
        const pass = isEqual(result, expectation);
        if (!pass) throw Error(`Expected ${JSON.stringify(result)} to equal ${JSON.stringify(expectation)}`)
    }
}

describe('A trivial map (1x1)', function () {

    var map = [[true]];

    it('Should return an empty array, since we\'re already at the goal', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 0, y: 0 }), []);
    });
});

describe('A pretty simple map (2x2)', function () {
    var map = [[true, false],
    [true, true]];

    it('Should return the only correct move', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 1, y: 0 }), ['right']);
    });

    it('Should return the only moves necessary', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 1, y: 1 }), ['right', 'down']);
    });
});

describe('A linear map(1x4)', function () {
    var map = [[true], [true], [true], [true]];

    it('Should return a chain of moves to the right', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 3, y: 0 }), ['right', 'right', 'right']);
    });

    var map = [[true], [true], [true], [true]];

    it('Should return a chain of moves to the left', function () {
        Test.assertSimilar(solve(map, { x: 3, y: 0 }, { x: 0, y: 0 }), ['left', 'left', 'left']);
    });
});

describe('Should walk around an obstacle (3x3 map)', function () {
    var map = [[true, true, true],
    [false, false, true],
    [true, true, true]];

    it('Should return the right sequence of moves', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 2, y: 0 }), ['down', 'down', 'right', 'right', 'up', 'up']);
    });
});

describe('Should be able to change directions multiple times (5x5 map)', function () {
    var map = [[true, true, false, false, false],
    [false, true, true, false, false],
    [false, false, true, true, false],
    [false, false, false, true, true],
    [false, false, false, false, true]];

    it('Should return a step sequence of moves', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 4, y: 4 }),
            ['down', 'right', 'down', 'right', 'down', 'right', 'down', 'right']);
    });
});

describe('Should avoid dead-ends (5x5 map)', function () {
    var map = [[true, true, true, false, true],
    [false, false, true, false, true],
    [true, true, true, true, true],
    [true, false, true, false, false],
    [false, true, true, true, true]];

    it('Should return the right moves', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 4, y: 4 }), ['down', 'down', 'right', 'right', 'right', 'right', 'down', 'down'])
    });
});

describe('Should be IRONHACK worthy', function () {
    var map = [[true, false, true, true, true, false], [true, false, true, false, true, false], [true, true, true, false, true, false], [false, false, false, false, true, false], [true, true, true, true, true, false], [true, false, false, false, false, true], [true, true, true, true, true, true]];

    var solution = ['right', 'right',
        'down', 'down',
        'left', 'left',
        'down', 'down',
        'right', 'right', 'right', 'right',
        'up', 'up', 'up', 'up',
        'right', 'right',
        'down', 'down', 'down', 'down', 'down',
        'left'];

    it('Sh0u1d r3turn th3 r1ght m0v35', function () {
        Test.assertSimilar(solve(map, { x: 0, y: 0 }, { x: 5, y: 5 }), solution)
    });
});

/*  BONUS: cyclical maze
    I was thinking that solve can traverse every single possible path by visiting every possible square.
    A possible square is one that is open, in bounds, and it has not been visited before.
    This will create several possibility paths, but only the path that finds the exit returns an array of moves,
    the other paths return null. To avoid going back, I will modify the map, converting boolean to number to mark visited cells.
    I will also have helpers to determine when the miner is going left, right, down. etc.
    Being in a cell means being in a closure, while being in a cell, if the returned value from solve is an array
    this means that path was succesful, so we push the direction that path took into the result. This will chain back
    to the original caller, returning the path to the exit!
    In the other hand, while being on a cell, if the returned value from solve is null, this means that path leads nowhere.
    In theory, a maze with no exit should return null.
*/

describe('Should work with a cyclical maze with more than one possible path', function () {
    
    var map = [
            [true, true, true, false],
            [true, false, true, false],
            [true, true, true, true],
            [false, false, false, true]
        ];

    var solution1 = ['right', 'right', 'down', 'down', 'down', 'right'];
    var solution2 = ['down', 'down', 'right', 'right', 'down', 'right'];

    it('should return one possible exit', function () {
        const path = solve(map, { x: 0, y: 0 }, { x: 3, y: 3 })
        const pass = isEqual(path, solution1) || isEqual(path, solution2)
        if(!pass) throw Error('Sorry');
    });
});

describe('Should work with a cyclical maze with one possible path', function () {
    
    var map = [
        [false, true, true, true],
        [false, true, true, true],
        [false, true, false, true],
        [true, true, true, true]
    ];

    var solution = ['up']; // note that 'up' is the last attempted path (see line 36 in index.js)

    it('should return one possible exit', function () {
        Test.assertSimilar(solve(map, { x: 3, y: 1 }, { x: 3, y: 0 }), solution)
    });
});