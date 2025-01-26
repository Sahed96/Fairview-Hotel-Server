const express = require('express');
const {
  getAllRooms,
  getRoomDetails,
  updateAvailability,
  getSpecialRooms,
  getSortedRooms,
  updateUnavailability,
} = require('../controllers/roomController');
const router = express.Router();

router.get('/allRooms', getAllRooms);
router.get('/allRooms/:id', getRoomDetails);
router.patch('/availability/:id', updateAvailability);
router.patch('/unavailability/:id', updateUnavailability);
router.get('/specialRoom', getSpecialRooms);
router.get('/sortedData', getSortedRooms);

module.exports = router;
