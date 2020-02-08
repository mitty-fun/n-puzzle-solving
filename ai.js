let hashTable = undefined
const nodes = []
const steps = []

function AI (game) {
    const virtual = new Puzzle()
    virtual.grid = JSON.parse(JSON.stringify(game.grid))
    virtual.player = JSON.parse(JSON.stringify(game.player))
    virtual.width = game.width
    virtual.height = game.height
    nodes.length = steps.length = 0

    hashTable = getHashTable(game)
    re = resolve(virtual, 0)
    
    const id = setInterval(() => {
        const action = steps.shift()
        if (action === 'U') game.moveUp()
        else if (action === 'D') game.moveDown()
        else if (action === 'L') game.moveLeft()
        else if (action === 'R') game.moveRight()
        else clearInterval(id)
    }, 100)
}

function resolve(game, deep = 0) {

    if (nodes.length > 400000 || deep > 100) return

    const hash = getInitHash(game, hashTable)
    if (nodes.includes(hash)) return false
    else nodes.push(hash)

    if (game.moveUp()) {
        steps.push('U')
        if (game.status === 'gameover') return true
        if (resolve(game, deep + 1)) return true
        game.undo()
        steps.pop()
    }

    if (game.moveDown()) {
        steps.push('D')
        if (game.status === 'gameover') return true
        if (resolve(game, deep + 1)) return true
        game.undo()
        steps.pop()
    }

    if (game.moveLeft()) {
        steps.push('L')
        if (game.status === 'gameover') return true
        if (resolve(game, deep + 1)) return true
        game.undo()
        steps.pop()
    }

    if (game.moveRight()) {
        steps.push('R')
        if (game.status === 'gameover') return true
        if (resolve(game, deep + 1)) return true
        game.undo()
        steps.pop()
    }

    return false

}

function getHashTable (game) {
    const table = {}
    
    for (let y = 0; y < game.height; y++) {
        table[y] = {}
        for (let x = 0; x < game.width; x++) {
            table[y][x] = {}
            for (let s = 0; s<game.width*game.height; s++ ) {
                table[y][x][s + 1] = Math.floor(Math.random()*(2**40))
            }
        }   
    }
    return table
}

function getInitHash (game, table) {
    let hash = 0
    for (let y = 0; y < game.height; y++) {
        for (let x = 0; x < game.width; x++) {
            const status = game.grid[y][x]
            hash ^= table[y][x][status + 1]
        }   
    }
    return hash
}
