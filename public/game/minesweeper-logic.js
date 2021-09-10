/**
 * A class that handles all of the game logic for Minesweeper
 */
class GameLogic {
    /**
     * 
     * @param {number} xTiles Number of tiles in the x-direction
     * @param {number} yTiles Number of tiles in the y-direction
     * @param {number} numMines Number of mines
     */
    constructor(xTiles, yTiles, numMines) {
        // Save input variables
        this.xTiles = xTiles
        this.yTiles = yTiles
        this.numMines = numMines

        // Declare game counters
        this.score = 0
        this.playerMoves = 0
        this.remainingTiles = (xTiles * yTiles) - numMines

        // Generate grid of MinesweeperTile objects
        const generateMineArray = () => {
            const mineList = mineListGenerator(numMines, xTiles * yTiles)

            let tileGrid = []

            // Create rows of tiles
            for (let i = 0; i < yTiles; i++) {
                
                // Create new row
                let currentRow = []

                // Create tiles and append to current row
                for (let j = 0; j < xTiles; j++) {
                    const hasMine = () => {
                        // Check if the current index resides in MineList
                        if (mineList.indexOf(i * xTiles + j + 1) === -1) {
                            return false
                        } else {
                            return true
                        }
                    }

                    let newTile = new MinesweeperTile(hasMine())

                    currentRow.push(newTile)
                }

                // Push the current row
                tileGrid.push(currentRow)
            }

            // Return grid
            return tileGrid
        }

        this.gameGrid = generateMineArray()

        // A helper function which increments a Tile's adjacentMines, if that tile is valid.
        const incrementMinesIfValid = (xCoord, yCoord) => {
            // Are the coords in range?
            if (xCoord >= 0 && xCoord < xTiles && yCoord >= 0 && yCoord < yTiles) {
                // Increment adjacentMines counter
                this.gameGrid[xCoord][yCoord].incrementAdjacentMines()
            }
        }

        // Check all tiles for mines, and update the adjacentMines counter for neighboring tiles.
        for (let i = 0; i < yTiles; i++) {

            for (let j = 0; j < xTiles; j++) {
                // Does the current tile have a mine?
                if (this.gameGrid[i][j].getHasMine()) {
                    // Update all (valid) adjacent tiles
                    incrementMinesIfValid(i - 1, j - 1)
                    incrementMinesIfValid(i - 1, j)
                    incrementMinesIfValid(i - 1, j + 1)
                    incrementMinesIfValid(i, j - 1)
                    incrementMinesIfValid(i, j + 1)
                    incrementMinesIfValid(i + 1, j - 1)
                    incrementMinesIfValid(i + 1, j)
                    incrementMinesIfValid(i + 1, j + 1)
                }
            }
        }
    }

    /**
     * 
     * @param {number} xCoord is the x coordinate of the Tile
     * @param {number} yCoord is the y coordinate of the Tile
     * @returns the MinesweeperTile object of the appropraite tile
     */
    getTile(xCoord, yCoord) {
        return this.gameGrid[xCoord][yCoord]
    }

    /**
     * @param {number} xCoord is the x coordinate of the Tile
     * @param {number} yCoord is the y coordinate of the Tile
     * @returns a boolean value signifying if the Tile is within the grid range or not
     */
    isTileInRange(xCoord, yCoord) {
        if (xCoord >= 0 && xCoord < this.xTiles && yCoord >= 0 && yCoord < this.yTiles) {
            return true
        } else {
            return false
        }
    }

    /**
     * 
     * @param {number} xCoord is the x coordinate of the Tile
     * @param {number} yCoord is the y coordinate of the Tile
     */
    tileUncovered(xCoord, yCoord) {
        // Increment counter for player moves
        this.playerMoves++
        
        // Get a copy of the last clicked Tile
        const clickedTile = this.getTile(xCoord, yCoord)

        // Check if we just uncovered a mine or a tile with 0 neighboring mines.
        if (clickedTile.hasMine) {
            return {
                logicType: 'gameOver',
                logic: this.gameEndingLogic()
            }
        } else if (clickedTile.getAdjacentMines() === 0) {
            this.remainingTiles--
            return {
                logicType: 'massUncover',
                logic: this.massUncoverLogic(xCoord, yCoord)
            }
        } else {
            this.awardPoints(clickedTile)
        }
    }

    /**
     * Takes in a 'tileObject' and awards points based on adjacent mines.
     * @param {Object} tileObject a MinesweeperTile object.
     */
    awardPoints(tileObject) {
        this.score += 100 * tileObject.getAdjacentMines()
        this.remainingTiles--
    }

    /**
     * @returns the game's current score.
     */
    getPoints() {
        return this.score
    }

    /**
     * @returns the amount of tiles left to uncover to win the game
     */
    getRemainingTiles() {
        return this.remainingTiles
    }

    /**
     * @returns the number of player moves.
     */
    getPlayerMoves() {
        return this.playerMoves
    }

    /**
     * A function that returns all tiles that must be revealed, after a game-losing move.
     * @returns an Object containing an array of Tiles to iterate over and reveal.
     */
    gameEndingLogic() {
        var tilesToUncover = []

        for (let i = 0; i < this.xTiles; i++) {
            for (let j = 0; j < this.yTiles; j++) {
                // Get current tile
                const tile = this.getTile(i, j)

                if (!tile.getIsUncovered() && (tile.getHasMine() || !tile.getHasMine() && tile.getIsFlagged())) {
                    // Add current tile coords to list
                    tilesToUncover.push({x: i, y: j})

                    // Force reveal mine
                    tile.forceTileReveal()
                }
            }
        }

        // Return list of coords to update
        return tilesToUncover
    }

    /**
     * A function that returns all tiles that must be revealed, taking in the X and Y coords of a 0 tile.
     * @param {number} xCoord is the x coordinate of the Tile
     * @param {number} yCoord is the y coordinate of the Tile
     * @returns an Object containing an array of Tiles to iterate over and reveal.
     */
    massUncoverLogic(xCoord, yCoord) {
        // Set up sorting arrays for tracking
        var tilesToIgnore = []
        var tilesToUncover = []
        var unchecked = [{x: xCoord, y: yCoord}]

        /**
         * Loop through all unchecked tiles. If the current tile is empty, check all neighbors.
         * Sort each tile into the appropriate array until there are no more tiles to check.
         */
        while (unchecked.length > 0) {
            // Get the current tile
            const currentTile = this.getTile(unchecked[0].x, unchecked[0].y)

            // Function to check if tile exists & whether it is already in an array.
            const addToUncheckedIfValid = (coordObject) => {
                // Callback function for all .some calls
                const matches = (coord) => coord.x === coordObject.x && coord.y === coordObject.y

                if (this.isTileInRange(coordObject.x, coordObject.y) && 
                !tilesToIgnore.some(matches) && 
                !tilesToUncover.some(matches) &&
                !unchecked.some(matches)
                ) {
                    unchecked.push(coordObject)
                }
            }

            // Check adjacentMines counter to determine if we must check adjacent Tiles
            if (currentTile.getAdjacentMines() === 0) {
                const tilesToCheck = [
                    {x: unchecked[0].x - 1, y: unchecked[0].y - 1},
                    {x: unchecked[0].x - 1, y: unchecked[0].y},
                    {x: unchecked[0].x - 1, y: unchecked[0].y + 1},
                    {x: unchecked[0].x, y: unchecked[0].y - 1},
                    {x: unchecked[0].x, y: unchecked[0].y + 1},
                    {x: unchecked[0].x + 1, y: unchecked[0].y - 1},
                    {x: unchecked[0].x + 1, y: unchecked[0].y},
                    {x: unchecked[0].x + 1, y: unchecked[0].y + 1}
                ]

                // Check tiles and add to unchecked
                tilesToCheck.forEach(coordPair => {
                    addToUncheckedIfValid(coordPair)
                })
            }
            
            // Determine correct placement of the current Tile
            if (currentTile.getIsUncovered()) {
                // Already uncovered, no need to do antyhing
                tilesToIgnore.push(unchecked[0])
                unchecked.shift()
            } else {
                // Uncover
                currentTile.uncoverTile()
                this.awardPoints(currentTile)
                tilesToUncover.push(unchecked[0])
                unchecked.shift()
            }
        }

        // Return list of coords to update
        return tilesToUncover
    }
}

/**
 * Helper function mineListGenerator returns an array of valid mine indexes, whose length matches
 * @param {number} numMines is the integer value of the number of mines required.
 * @param {number} maxTiles is the integer value of the total number of tiles.
 */
mineListGenerator = (numMines, maxTiles) => {
    var mineList = []
    
    // generate mine indexes
    while (mineList.length < numMines) {
        // generate new mine location
        const newMineIndex = Math.round(Math.random() * maxTiles)

        // verify a mine does not exist at that index already. Push the new index if confirmed.
        if (mineList.indexOf(newMineIndex) === -1) {
            mineList.push(newMineIndex)
        }
    }

    return mineList
}