function solve(map, miner, exit) {
    map = deepClone(map)
    const result = [];
    markVisited(map, miner);
    if (positionsMatch(miner, exit)) return result

    const leftTurn = left(miner)
    const rightTurn = right(miner)
    const upTurn = up(miner)
    const downTurn = down(miner)

    if (canTake(map, leftTurn)) {
        const r = solve(map, leftTurn, exit)
        if (r) {
            r.unshift('left')
            return r
        }
    }

    if (canTake(map, rightTurn)) {
        const r = solve(map, rightTurn, exit)
        if (r) {
            r.unshift('right')
            return r
        }
    }

    if (canTake(map, downTurn)) {
        const r = solve(map, downTurn, exit)
        if (r) {
            r.unshift('down')
            return r
        }
    }

    if (canTake(map, upTurn)) {
        const r = solve(map, upTurn, exit)
        if (r) {
            r.unshift('up')
            return r
        }
    }

    return null;

}

/* to avoid mutating map */
function deepClone(arr) {
    return arr.map(function(inner) {
        return inner.slice();
    });
}

/* going left means substracting one from x */
function left(pos) {
    return { x: pos.x - 1, y: pos.y }
}

/* going right means adding one to x */
function right(pos) {
    return { x: pos.x + 1, y: pos.y }
}

/* going down means adding one to y */
function down(pos) {
    return { x: pos.x, y: pos.y + 1 }
}

/* going up means substracting one from y */
function up(pos) {
    return { x: pos.x, y: pos.y - 1 }
}

function positionsMatch(pos1, pos2) {
    return (pos1.x === pos2.x) && (pos1.y === pos2.y)
}

/* marks a cell as visited by converting boolean to a number, since we cloned the map we are not affecting the callers scope*/
function markVisited(map, pos) {
    map[pos.x][pos.y] = 1
}

/* returns true when the cell is visitable; is unvisited, is open, is in bounds  */
function canTake(map, pos) {
    if (!isInBounds(map, pos)) return false
    const dest = map[pos.x][pos.y]
    return typeof dest === "boolean" //is unvisited
        && dest //is open 
}

function isInBounds(map, pos) {
    return map[pos.x] !== undefined && map[pos.x][pos.y] !== undefined;
}

module.exports = {
    solve
}