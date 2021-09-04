/**
 * A class that handles the gamestate of the Tile object.
 */
class MinesweeperTile {
    
    constructor(hasMine) {
        this.hasMine = hasMine
        this.isFlagged = false
        this.isUncovered = false
        this.adjacentMines = 0
    }

    /**
     * Sets isFlagged property.
     * @param {Boolean} bool 
     */
    setIsFlagged(bool) {
        this.isFlagged = bool
    }

    /**
     * Sets isUncovered to true.
     */
    uncoverTile() {
        if (!this.isUncovered) {
            this.isUncovered = true
        } else {
            throw new Error('MinesweeperTile is already uncovered.')
        }
    }

    /**
     * Increments the adjacentMines counter by 1.
     */
    incrementAdjacentMines() {
        this.adjacentMines++
        
        // Check for out of bounds
        if (this.adjacentMines > 8) {
            throw new Error('MinesweeperTile has more mines than logically possible.')
        }
    }
    
    /**
     * @returns a Boolean value determining if the Tile has a mine.
     */
    getHasMine() {
        return this.hasMine
    }

    /**
     * @returns a Boolean value determining if the Tile has been flagged by the player.
     */
    getIsFlagged() {
        return this.isFlagged
    }

    /**
     * @returns a Boolean value determining if the Tile has been uncovered by the player yet.
     */
    getIsUncovered() {
        return this.isUncovered
    }
    
    /**
     * @returns an Integer value holding the number of mines adjacent to the Tile.
     */
    getAdjacentMines() {
        return this.adjacentMines
    }
}