const express = require('express');
const {
  getAllBookedRooms,
  getBookedRoomDetails,
  addBookedRoom,
  deleteBookedRoom,
  updateBookingDates,
} = require('../controllers/bookingController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Routes
router.get('/bookedRoom', verifyToken, getAllBookedRooms); // Get all booked rooms for a user
router.get('/bookedRoom/:id', verifyToken, getBookedRoomDetails); // Get details of a specific booking
router.post('/bookedRoom', addBookedRoom); // Add a new booking
router.delete('/bookedRoom/:id', deleteBookedRoom); // Delete a booking
router.patch('/update/:id', updateBookingDates); // Update booking dates

module.exports = router;
