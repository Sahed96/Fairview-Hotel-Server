const { client } = require('../config/database');
const reviewCollection = client.db('roomsDB').collection('feedBack');


module.exports = { reviewCollection };