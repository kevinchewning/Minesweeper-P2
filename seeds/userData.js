const { User } = require('../models');

const userData = [
    {
        username: 'user1',
        email: 'user1@email.com',
        password: 'password1'
    },
    {
        username: 'user2',
        email: 'user2@email.com',
        password: 'password2'
    },
    {
        username: 'user3',
        email: 'user3@email.com',
        password: 'password3'
    },
    {
        username: 'user4',
        email: 'user4@email.com',
        password: 'password4'
    },
    {
        username: 'user5',
        email: 'user5@email.com',
        password: 'password5'
    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;