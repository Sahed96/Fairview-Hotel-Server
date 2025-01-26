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
router.get('/', verifyToken, getAllBookedRooms); // Get all booked rooms for a user
router.get('/:id', verifyToken, getBookedRoomDetails); // Get details of a specific booking
router.post('/', addBookedRoom); // Add a new booking
router.delete('/:id', deleteBookedRoom); // Delete a booking
router.patch('/update/:id', updateBookingDates); // Update booking dates

module.exports = router;
