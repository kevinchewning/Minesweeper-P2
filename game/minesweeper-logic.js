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
        this.xTiles = xTiles
        this.yTiles = yTiles
        this.numMines = numMines

        // Generate grid of MinesweeperTile objects
        this.gameGrid = generateMineArray = () => {
            const mineList = mineListGenerator(numMines)

            let tileGrid = []

            // Create rows of tiles
            for (let i = 0; i < yTiles; i++) {
                
                // Create new row
                let currentRow = []

                // Create tiles and append to current row
                for (let j = 0; j < xTiles; j++) {
                    const hasMine = () => {
                        // Check if the current index resides in MineList
                        if (mineList.indexOf(i * 10 + j) === -1) {
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
            
            return tileGrid
        }


    }


}

/**
 * Helper function mineListGenerator returns an array of valid mine indexes, whose length matches
 * @param {number} numMines is the integer value of the number of mines required.
 */
mineListGenerator = (numMines) => {
    var mineList = []
    
    // generate mine indexes
    while (mineList.length < numMines) {
        // generate new mine location
        const newMineIndex = Math.round(Math.random() * numMines)

        // verify a mine does not exist at that index already. Push the new index if confirmed.
        if (mineList.indexOf(newMineIndex) === -1) {
            mineList.push(newMineIndex)
        }
    }

    return mineList
}