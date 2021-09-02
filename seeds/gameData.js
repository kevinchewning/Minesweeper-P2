const { User, Game } = require('../models')

const seedGames = async () => {
    try {
        const userData = await User.findAll({attributes: ['id']});
    
        const userIDs = userData.map((user) => user.get({ plain : true}))
    
        const gameData = [
            {
                user_id: userIDs[0].id,
                score: 10000,
                duration: 300000,
                win: true,
                player_moves: 50
            },
            {
                user_id: userIDs[1].id,
                score: 15000,
                duration: 250000,
                win: true,
                player_moves: 48
            },
            {
                user_id: userIDs[3].id,
                score: 5000,
                duration: 100000,
                win: false,
                player_moves: 18
            },
            {
                user_id: userIDs[0].id,
                score: 100000,
                duration: 120000,
                win: true,
                player_moves: 66
            },
            {
                user_id: userIDs[4].id,
                score: 0,
                duration: 0,
                win: false,
                player_moves: 1
            },
            {
                user_id: userIDs[1].id,
                score: 120000,
                duration: 90000,
                win: true,
                player_moves: 45
            },
        ]
    
        Game.bulkCreate(gameData);
    } catch (err) {
        console.error(err)
    }
    
};

module.exports = seedGames;