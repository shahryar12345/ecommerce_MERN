const mongoose = require('mongoose');

var ProductReviewSchema = {
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

var ProductReview = (module.exports = mongoose.model('ProductReview', ProductReviewSchema));

module.exports.addReview = (newReview, callback) => {
  newReview.save(callback);
};

module.exports.getReview = (productId, callback) => {
  var query = { productId: productId };
  ProductReview.find(query, callback);
};
