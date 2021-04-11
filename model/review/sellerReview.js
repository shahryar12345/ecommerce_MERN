const mongoose = require('mongoose');

var SellerReviewSchema = {
  buyerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  sellerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  orderId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
};

var SellerReview = (module.exports = mongoose.model('SellerReview', SellerReviewSchema));

module.exports.addReview = (newReview, callback) => {
  newReview.save(callback);
};

module.exports.getReview = (sellerId, callback) => {
  var query = { sellerId: sellerId };
  SellerReview.find(query, callback);
};
