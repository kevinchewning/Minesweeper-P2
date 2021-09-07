// Set up minesweeper config
var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 700,
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
var playable = true
var recievingInput = false
var shiftKey
var timer
var timerEvent
var scoreText
var timerText

const timeLimit = 180

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
    var layer = map.createLayer('layer', tiles, 44, 144)

    // map the CTRL key
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

    // Initialize timer
    timer = new Phaser.Time.TimerEvent({ delay: 1000 * timeLimit })
    timerEvent = this.time.addEvent(timer)

    // Initialize text
    const textSettings = { fontFamily: 'Trebuchet MS, sans-serif, serif', fontSize: '32px', stroke: '#000', strokeThickness: 3 }
    scoreText = this.add.text(44, 44, 'Score: 0', textSettings)
    timerText = this.add.text(410, 44, `Time: ${timeLimit}`, textSettings)

}

function update(time, delta) {
    
    // Check whether the game is in a playable state; not at the game end
    if (playable) {
        
        // Update text
        scoreText.setText(`Score: ${gameLogic.getPoints()}`)
        timerText.setText(`Time: ${Math.floor(timer.getRemainingSeconds())}`)
        
        // Get current pointer coord
        var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main)

        if (this.input.manager.activePointer.primaryDown && !recievingInput) {
            // Toggle recievingInput
            recievingInput = true

            // Rounds down to nearest tile
            var pointerTileX = map.worldToTileX(worldPoint.x)
            var pointerTileY = map.worldToTileY(worldPoint.y)
            
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
                        // Update tile displays
                        additionalLogic.logic.forEach((coordPair) => {
                            const index = gameLogic.getTile(coordPair.x, coordPair.y).getTileIndex()
                            map.putTileAt(index, coordPair.x, coordPair.y)
                            
                            // Pause the clock
                            timerEvent.paused = true
                            playable = false
                        })
                    } else if (additionalLogic && additionalLogic.logicType === 'massUncover') {
                        // Update tile displays
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
}