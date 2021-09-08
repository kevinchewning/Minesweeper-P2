/**
 * A class that handles the gamestate of the Tile object.
 */
class MinesweeperTile {
    
    constructor(hasMine) {
        this.hasMine = hasMine
        this.isFlagged = false
        this.isUncovered = false
        this.adjacentMines = 0
        this.tileIndex = 9
    }

    /**
     * Sets isFlagged property.
     * @param {Boolean} bool 
     */
    setIsFlagged(bool) {
        

        // Flag can only be toggled if the tile is not uncovered
        if (bool && !this.getIsUncovered()) {
            this.isFlagged = bool
            
            this.tileIndex = 10
            return this.tileIndex
        } else if (!this.getIsUncovered()) {
            this.isFlagged = bool
            
            this.tileIndex = 9
            return this.tileIndex
        } else {
            return this.tileIndex
        }
    }

    /**
     * Sets isUncovered to true.
     * @returns an Integer representing the correct Tile index for the current Tile configuration, when uncovered by the player directly
     */
    uncoverTile() {
        if (!this.isUncovered) {
            this.isUncovered = true
        } else {
            console.log('MinesweeperTile is already uncovered.')
        }

        // Set and return the tile index
        if (this.getHasMine()) {
            this.tileIndex = 13
            return this.tileIndex
        } else {
            this.tileIndex = this.getAdjacentMines()
            return this.tileIndex
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

    /**
     * @returns an Integer value representing the Tile Index
     */
    getTileIndex() {
        return this.tileIndex
    }

    /**
     * @returns an Integer representing the correct Tile index for the current Tile configuration, when uncovered by a game-ending move.
     */
    forceTileReveal() {
        // Check if the tile is uncovered
        if (!this.getIsUncovered()) {
            // Check if this tile has a mine
            if (this.hasMine) {
                // Return the Tile index for a mine
                this.tileIndex = 12
                return this.tileIndex
            } else if (this.isFlagged) {
                // If this tile doesn't have a mine, but was flagged, return the Tile index for an incorrect flag
                this.tileIndex = 11
                return this.tileIndex
            }
        }
    }
}