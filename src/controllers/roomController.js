// const { client } = require('../config/database');
// const roomCollection = client.db('roomsDB').collection('allRooms');

const { ObjectId } = require('mongodb');
const { roomCollection } = require('../model/allRoomsModel');

const getAllRooms = async (req, res) => {
  const rooms = await roomCollection.find().toArray();
  console.log(rooms);
  res.send(rooms);
};

const getRoomDetails = async (req, res) => {
  const id = req.params.id;
  const room = await roomCollection.findOne({ _id: new ObjectId(id) });
  res.send(room);
};

const updateAvailability = async (req, res) => {
  const id = req.params.id;
  const availability = req.body.availability || 'unavailable';
  const result = await roomCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { availability } }
  );
  res.send(result);
};

const getSpecialRooms = async (req, res) => {
  const rooms = await roomCollection.find({ status: 'FEATURED' }).toArray();
  res.send(rooms);
};

const getSortedRooms = async (req, res) => {
  const query = req.query.value;
  let priceRange = {};
  if (query === 'low') {
    priceRange = { price: { $lt: 500 } };
  }
  if (query === 'high') {
    priceRange = { price: { $gte: 500 } };
  }
  const result = await roomCollection.find(priceRange).toArray();
  res.send(result);
};

module.exports = {
  getAllRooms,
  getRoomDetails,
  updateAvailability,
  getSpecialRooms,
  getSortedRooms,
};
