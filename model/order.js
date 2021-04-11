const mongoose = require('mongoose');

var OrderSchema = mongoose.Schema({
  buyerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  addressId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  product: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      productPrice: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      sellerId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      deliveryStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending',
      },
      deliveryDate: {
        type: Date,
        default: null,
      },
      productReviewed: {
        type: Boolean,
        default: false,
      },
      productReviewId: {
        type: mongoose.Types.ObjectId,
        default: null,
      },
      productReviewDate: {
        type: Date,
        default: null,
      },
      sellerReviewed: {
        type: Boolean,
        default: false,
      },
      sellerReviewId: {
        type: mongoose.Types.ObjectId,
        default: null,
      },
      sellerReviewDate: {
        type: Date,
        default: null,
      },
    },
  ],
});

var Order = (module.exports = mongoose.model('Order', OrderSchema));

module.exports.addOrder = (newOrder, callback) => {
  newOrder.save(callback);
};

module.exports.findOrder = (buyerId, productId, callback) => {
  var query = { buyerId: buyerId, 'product.productId': productId };
  Order.findOne(query, callback);
};

module.exports.getOrderById = (orderId, callback) => {
  Order.findById(orderId, callback);
};

module.exports.getOrderedProduct = (orderId, productId, callback) => {
  orderId = mongoose.Types.ObjectId(orderId);
  productId = mongoose.Types.ObjectId(productId);
  var query = { _id: orderId, 'product.productId': productId };
  var update = { $set: { 'product.$.deliveryStatus': true } };
  Order.findOneAndUpdate(query, update, callback);
};

module.exports.deleteOrder = (orderId, callback) => {
  var query = { _id: orderId };
  Order.deleteOne(query, callback);
};

module.exports.findSellerInOrder = (buyerId, sellerId, callback) => {
  var query = { buyerId: buyerId, 'product.sellerId': sellerId };
  Order.findOne(query, callback);
};

module.exports.getSellerOrders = (sellerId, callback) => {
  sellerId = mongoose.Types.ObjectId(sellerId);
  var query = { 'product.sellerId': sellerId };
  Order.aggregate([
    { $unwind: '$product' },
    { $match: query },
    {
      $lookup: {
        from: 'products',
        localField: 'product.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
  ]).exec(callback);
};

module.exports.getSellerOrderDetails = (sellerId, callback) => {
  sellerId = mongoose.Types.ObjectId(sellerId);
  var query = { 'product.sellerId': sellerId };
  Order.aggregate([
    { $unwind: '$product' },
    { $match: query },
    {
      $lookup: {
        from: 'sellers',
        localField: 'product.sellerId',
        foreignField: '_id',
        as: 'seller',
      },
    },
    {
      $lookup: {
        from: 'buyeraddresses',
        localField: 'addressId',
        foreignField: '_id',
        as: 'address',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
  ]).exec(callback);
};

module.exports.getProductsToReviwed = (inbuyerId, callback) => {
  var BuyerId = mongoose.Types.ObjectId(inbuyerId);
  var query2 = { buyerId: BuyerId, 'product.quantity': { $eq: '4' } };
  var query = { buyerId: BuyerId };

  //Order.find(query , callback);
  // Order.aggregate([ {$match : query } ,
  //   {
  //     $project: { _id : 1 ,
  //     product: {
  //      $filter: {
  //         input: "$product",
  //         as: "product",
  //         cond: { $eq: [ "$$product.productReviewed", false ] }
  //             }
  //           }
  //         }
  //   }]).exec(callback);

  // id = mongoose.Types.ObjectId(id);
  //   var query = { sellerId: id };
  //   Product.aggregate([{ $match: query },
  //   {
  //       $lookup: {
  //           from: 'productreviews',
  //           localField: '_id',
  //           foreignField: 'productId',
  //           as: 'productReviews'
  //       }
  //   }, { $project: { productReviews: 1 } }
  //   ]).exec(callback);

  /// Reviews API through Order

  Order.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'buyers',
        localField: 'buyerId',
        foreignField: '_id',
        as: 'buyers',
      },
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'product.sellerId',
        foreignField: '_id',
        as: 'sellers',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product.productId',
        foreignField: '_id',
        as: 'products',
      },
    },

    //   { "$project": {
    //       "id": 1,
    //       "value": 1,
    //       "contain": 1,
    //       "childs": {
    //          "$filter": {
    //              "input": "$childs",
    //              "as": "child",
    //              "cond": { "$eq": [ "$$child.value", "1" ] }
    //          }
    //       }
    //   }
    // }
  ]).exec(callback);
};
