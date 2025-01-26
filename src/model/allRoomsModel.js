const { client } = require('../config/database');
const roomCollection = client.db('roomsDB').collection('allRooms');

module.exports = { roomCollection };
