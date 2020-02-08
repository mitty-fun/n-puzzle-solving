class Puzzle {

    constructor(width = 3, height = 3) {
        this.width = width
        this.height = height
        this.player = {}
        this.logs = []
        this.status = 'playing'

        this.initGrid()
    }

    initGrid() {
        this.grid = {}
        for (let y=0; y<this.height; y++) {
            this.grid[y] = {}
            for (let x=0; x<this.width; x++) {
                this.grid[y][x] = x + y*this.width + 1
            }
        }
        this.player.x = this.width - 1
        this.player.y = this.height - 1
    }

    randomGrid() {
        this.status = 'playing'
        for (let i=0; i<100; i++) {
            let rand = Math.random()
            if (rand < 0.25) this.move(0, 1)
            else if (rand < 0.50) this.move(0, -1)
            else if (rand < 0.75) this.move(1, 0)
            else this.move(-1, 0)
        }
    }

    moveUp() {
        const bool = this.move(0, 1)
        if (bool) this.logs.push('U')
        return bool
    }

    moveDown() {
        const bool = this.move(0, -1)
        if (bool) this.logs.push('D')
        return bool
    }

    moveLeft() {
        const bool = this.move(1, 0)
        if (bool) this.logs.push('L')
        return bool
    }

    moveRight() {
        const bool = this.move(-1, 0)
        if (bool) this.logs.push('R')
        return bool
    }

    move(vx, vy) {
        const { x, y } = this.player
        const targetX = x + vx
        const targetY = y + vy
        if (0 <= targetX && targetX < this.width &&
            0 <= targetY && targetY < this.height) {
            const tmp = this.grid[targetY][targetX]
            this.grid[targetY][targetX] = this.grid[y][x]
            this.grid[y][x] = tmp
            this.player.x = targetX
            this.player.y = targetY
            this.checkIsWin()
            return true
        }
        return false
    }

    undo() {
        const diff = this.logs.pop()
        if (diff === 'U') this.move(0, -1)
        if (diff === 'D') this.move(0, 1)
        if (diff === 'R') this.move(1, 0)
        if (diff === 'L') this.move(-1, 0)
    }

    checkIsWin() {
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.width; x++) {
                if (this.grid[y][x] !== x + y*this.width + 1) {
                    return
                }
            }
        }
        this.status = 'gameover'
    }
}