const sequelize = require('../config/connection')
const seedUsers = require('./userData')
const seedGames = require('./gameData')

const seedAll = async () => {
    await sequelize.sync({force: true})

    await seedUsers();
    
    await seedGames();
    
    //process.exit(0);
};

seedAll();