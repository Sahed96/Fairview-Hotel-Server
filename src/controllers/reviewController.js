// const { client } = require('../config/database');
// const reviewCollection = client.db('roomsDB').collection('feedBack');

const { reviewCollection } = require("../model/feedbackModel");

const getAllReviews = async (req, res) => {
  const reviews = await reviewCollection.find().sort({ date: -1 }).toArray();
  res.send(reviews);
};

const getReviewDetails = async (req, res) => {
  const id = req.params.id;
  const reviews = await reviewCollection.find({ ratingId: id }).toArray();
  res.send(reviews);
};

const addReview = async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
};

module.exports = { getAllReviews, getReviewDetails, addReview };
