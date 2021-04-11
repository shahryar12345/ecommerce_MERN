var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var SellerAddressSchema = mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  business_address: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
  },
  warehouse_address: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
  },
});
// SellerAddressSchema.plugin(uniqueValidator);
var SellerAddress = (module.exports = mongoose.model('SellerAddress', SellerAddressSchema));
// var BusinessAddress = (module.exports = mongoose.model('BusinessAddress', AddressSchema));
// var WarehouseAddress = (module.exports = mongoose.model('WarehouseAddress', AddressSchema));

module.exports.addAddress = (sellerId, busAddress, warAddress, callback) => {
  var query = { seller_id: sellerId };
  console.log(query);
  var options = { upsert: true };
  BusinessAddress.findOneAndUpdate(query, busAddress, options, callback);
  WarehouseAddress.findOneAndUpdate(query, warAddress, options, callback);
};

module.exports.getWareHouseAddress = (id, callback) => {
  var query = { seller_id: id };
  var select = { address: 1, state: 1, area: 1, location: 1 };
  WarehouseAddress.find(query, select, callback).populate('seller-id');
};

module.exports.updateAddress = (sellerId, busAddress, warAddress, retAddress, callback) => {
  var query = { seller_id: sellerId };
  var options = { upsert: true, new: true, setDefaultsOnInsert: true };
  BusinessAddress.findOneAndUpdate(query, busAddress, options, callback);
  WarehouseAddress.findOneAndUpdate(query, warAddress, options, callback);
};

module.exports.getAddress = (id, callback) => {
  var query = { seller_id: id };
  console.log(id);
  BusinessAddress.findOne(query, callback);
};
