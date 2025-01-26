// const { client } = require('../config/database');
// const { ObjectId } = require('mongodb');
// const bookingCollection = client.db('roomsDB').collection('bookedRoom');

const { ObjectId } = require("mongodb");
const { bookingCollection } = require("../model/bookedRoomModel");

// Get all booked rooms for a user
const getAllBookedRooms = async (req, res) => {
  const userEmail = req.query.email;
  console.log('Owner info:', req.user);

  if (req.user.email !== userEmail) {
    return res.status(403).send({ message: 'Forbidden access' });
  }

  const query = { email: userEmail };
  const bookings = await bookingCollection.find(query).toArray();
  res.send(bookings);
};

// Get details of a specific booked room
const getBookedRoomDetails = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const booking = await bookingCollection.findOne(query);
  res.send(booking);
};

// Add a new booking
const addBookedRoom = async (req, res) => {
  const booking = req.body;
  console.log('Adding booking:', booking);
  const result = await bookingCollection.insertOne(booking);
  res.send(result);
};

// Delete a booking
const deleteBookedRoom = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
};

// Update booking dates
const updateBookingDates = async (req, res) => {
  const id = req.params.id;
  const { dateFrom, dateTo } = req.body;
  console.log('Updating booking:', req.body);

  const filter = { _id: new ObjectId(id) };
  const updatedData = {
    $set: {
      dateFrom,
      dateTo,
    },
  };

  const result = await bookingCollection.updateOne(filter, updatedData);
  res.send(result);
};

module.exports = {
  getAllBookedRooms,
  getBookedRoomDetails,
  addBookedRoom,
  deleteBookedRoom,
  updateBookingDates,
};
