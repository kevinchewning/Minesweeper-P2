const { User } = require('../models');

const userData = [
    {
        username: 'Boomboom88',
        email: 'user1@email.com',
        password: 'password1'
    },
    {
        username: 'xXSweeps4DayzXx',
        email: 'user2@email.com',
        password: 'password2'
    },
    {
        username: 'FlagPlanter1337',
        email: 'user3@email.com',
        password: 'password3'
    },
    {
        username: 'TippyToes00',
        email: 'user4@email.com',
        password: 'password4'
    },
    {
        username: 'Explosivo',
        email: 'user5@email.com',
        password: 'password5'
    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;