// Set up minesweeper config
var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    parent: 'body',
    backgroundColor: '#dfe8f5',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config)
var gameLogic = new GameLogic(16, 16, 40)
var map
var gameState = 'menu'
var recievingInput = false

function preload() {
    
    this.load.image('defaultTiles', '../assets/sprites/defaultTiles.png')
}

function create() {
    
    // Create starter tilemap data. All tiles are 'uncovered'.
    var mapStart = [
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
    ]

    // Initialize tilemap and data
    map = this.make.tilemap({ data: mapStart, tileWidth: 32, tileHeight: 32})
    var tiles = map.addTilesetImage("defaultTiles")
    var layer = map.createLayer('layer', tiles, 44, 244)

    // map the CTRL key
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

}

function update(time, delta) {
    
    // Get current pointer coord
    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main)

    // Rounds down to nearest tile
    var pointerTileX = map.worldToTileX(worldPoint.x)
    var pointerTileY = map.worldToTileY(worldPoint.y)

    if (this.input.manager.activePointer.primaryDown && !recievingInput) {
        // Toggle recievingInput
        recievingInput = true
        
        // Check if within a valid tile
        if (gameLogic.isTileInRange(pointerTileX, pointerTileY)) {
            
            // Get current clicked tile
            const clickedTile = gameLogic.getTile(pointerTileX, pointerTileY)
            
            // Check if CRTL key is pressed
            if (shiftKey.isDown) {
                // Reverse the toggle
                const newTileIndex = clickedTile.setIsFlagged(!clickedTile.getIsFlagged())
                map.putTileAt(newTileIndex, pointerTileX, pointerTileY)
            } else if (!clickedTile.getIsUncovered()) {
                // Begin swept logic
                const newTileIndex = clickedTile.uncoverTile()
                map.putTileAt(newTileIndex, pointerTileX, pointerTileY)

                // We just uncovered a tile, now we must check for 0 or a mine for further game logic.
                const additionalLogic = gameLogic.tileUncovered(pointerTileX, pointerTileY)
                if (additionalLogic && additionalLogic.logicType === 'gameOver') {
                    
                } else if (additionalLogic && additionalLogic.logicType === 'massUncover') {
                    additionalLogic.logic.forEach((coordPair) => {
                        const index = gameLogic.getTile(coordPair.x, coordPair.y).getTileIndex()
                        map.putTileAt(index, coordPair.x, coordPair.y)
                    })
                }
            }
        }
        
        
    } else if (!this.input.manager.activePointer.primaryDown) {
        // User released left click
        recievingInput = false
    }
}