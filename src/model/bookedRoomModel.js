const { client } = require('../config/database');
const { ObjectId } = require('mongodb');
const bookingCollection = client.db('roomsDB').collection('bookedRoom');


module.exports = {bookingCollection};