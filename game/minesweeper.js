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
    ctrlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)

}

function update(time, delta) {
    
    // Get current pointer coord
    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main)

    // Rounds down to nearest tile
    var pointerTileX = map.worldToTileX(worldPoint.x)
    var pointerTileY = map.worldToTileY(worldPoint.y)

    // Check if within a valid tile
    if (gameLogic.isTileInRange(pointerTileX, pointerTileY)) {

        if (this.input.manager.activePointer.leftButtonDown && ctrlKey.isDown) {
            const clickedTile = gameLogic.getTile(pointerTileX, pointerTileY)

            // Reverse the toggle
            const newTileIndex = clickedTile.setIsFlagged(!clickedTile.getIsFlagged())
            map.putTileAt(newTileIndex, pointerTileX, pointerTileY)
            
        } else if (this.input.manager.activePointer.leftButtonDown) {
            
            const clickedTile = gameLogic.getTile(pointerTileX, pointerTileY)
            
            // Begin swept logic
            if (!clickedTile.getIsUncovered()) {
                const newTileIndex = clickedTile.uncoverTile()
                map.putTileAt(newTileIndex, pointerTileX, pointerTileY)
            }
        }
    }

    /*
    if (this.input.manager.activePointer.leftButtonDown) {
        // Check if within a valid tile
        //console.log(pointerTileX, pointerTileY)

        if (gameLogic.isTileInRange(pointerTileX, pointerTileY)) {
            
            // Get current clicked tile
            const clickedTile = gameLogic.getTile(pointerTileX, pointerTileY)
            
            // Check if CRTL key is pressed
            if (ctrlKey.isDown) {
                // Reverse the toggle
                const newTileIndex = clickedTile.setIsFlagged(!clickedTile.getIsFlagged())
                map.putTileAt(newTileIndex, pointerTileX, pointerTileY)
            } else {
                // Begin swept logic
                if (!clickedTile.getIsUncovered()) {
                    const newTileIndex = clickedTile.uncoverTile()
                    map.putTileAt(newTileIndex, pointerTileX, pointerTileY)
                }
            }
        }
        
        
    } */
}