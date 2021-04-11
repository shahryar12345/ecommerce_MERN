const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const uniqueArrayPlugin = require('mongoose-unique-array');

var CartSchema = mongoose.Schema({
  buyerId: {
    type: mongoose.Types.ObjectId,
    unique: true,
    index: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
});

CartSchema.plugin(uniqueValidator);
CartSchema.plugin(uniqueArrayPlugin);
var Cart = (module.exports = mongoose.model('Cart', CartSchema));

module.exports.addItem = (productID, BuyerId, Newquantity, callback) => {
  var Product_ID = mongoose.Types.ObjectId(productID);
  var Buyer_ID = mongoose.Types.ObjectId(BuyerId);
  var CartItem = {
    buyerId: BuyerId,
  };
  var options = { upsert: true };
  var query = {
    buyerId: Buyer_ID,
    'products.productId': Product_ID,
  };
  var query2 = {
    buyerId: Buyer_ID,
  };

  Cart.findOneAndUpdate(query2, CartItem, options, (err, item) => {
    Cart.findOne(query, (err, itemFound) => {
      if (err) {
        // console.log('Error')
        console.log(err);
      } else {
        // console.log(itemFound)
        if (itemFound === null) {
          Cart.findOneAndUpdate(
            query2,
            { $push: { products: { productId: Product_ID, quantity: Newquantity } } },
            options,
            callback,
          );
        } else {
          //Cart.findOneAndUpdate(query2 , {$set: {"products.quantity" : Newquantity }} ,  callback );
          Cart.update(query, { $set: { 'products.$.quantity': Newquantity } }, callback);
          //TrendingProduct.findOneAndUpdate(query,{$set:{Days:{hits:trend.Days[0].hits+1,Date:d.getDate()}}},options,callback);
        }
      }
    });
  });

  //Cart.findOneAndUpdate(query , {$set : { products : {quantity : Newquantity , productId :  productID} } } , options , (callback) );
  //newOrder.save(callback);
};
