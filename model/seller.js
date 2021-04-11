var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');
const SellerAddress = require('./addresses/addressSeller');
const SellerIdInfo = require('./sellerIdInfo');
const SellerBankDetails = require('./sellerBankDetails');

var SellerSchema = mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
  },
  ownerName: {
    type: String,
  },
  phoneNo: {
    type: Number,
  },
  accountType: {
    type: String,
  },
  shopName: {
    type: String,
  },
  shopLocation: {
    type: String,
  },
  role: {
    type: String,
  },
  verified: {
    type: Boolean,
  },
  emailVerified: {
    type: Boolean,
  },
  token: {
    type: String,
  },
  status: {
    type: String,
  },
  stepsToDo: {
    type: Number,
  },
  sellerAddresses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: SellerAddress,
      default: null,
    },
  ],
  idInformation: [
    {
      type: mongoose.Schema.ObjectId,
      ref: SellerIdInfo,
      default: null,
    },
  ],
  bankDetails: [
    {
      type: mongoose.Schema.ObjectId,
      ref: SellerBankDetails,
      default: null,
    },
  ],
  priority: {
    type: Number,
  },
  password: {
    type: String,
  },
  referralKey: {
    type: String,
  },
  referralBy: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
    index: true,
  },
  productsAdded: {
    type: Number,
    default: 0,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
  abnNumber: {
    type: String,
  },
  rank: {
    type: Number,
  },
});
SellerSchema.plugin(uniqueValidator);
var Seller = (module.exports = mongoose.model('Seller', SellerSchema));

module.exports.createSeller = (newSeller, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newSeller.password, salt, (err, hash) => {
      newSeller.password = hash;
      newSeller.save(callback);
    });
  });
};

module.exports.getSellerByEmail = (email, callback) => {
  var query = { email: email };
  Seller.findOne(query, callback);
};

module.exports.incrementTotalProduct = id => {
  id = mongoose.Types.ObjectId(id);
  return Seller.findByIdAndUpdate(id, { $inc: { totalProducts: 1 } });
};

module.exports.getTopSellers = (offset = 0, size = 10) => {
  return Seller.find()
    .sort({ points: -1 })
    .limit(size)
    .skip(offset);
};

module.exports.getSellerForRank = id => {
  id = mongoose.Types.ObjectId(id);
  return Seller.find().sort({ points: -1 });
};

module.exports.updateRank = (id, rank) => {
  id = mongoose.Types.ObjectId(id);
  return Seller.findByIdAndUpdate(id, { rank: rank });
};

module.exports.incrementProductsAdded = id => {
  id = mongoose.Types.ObjectId(id);
  return Seller.findByIdAndUpdate(id, { $inc: { productsAdded: 1 } });
};

module.exports.incrementPoints = referralBy => {
  return Seller.findOneAndUpdate({ referralKey: referralBy }, { $inc: { points: 5 } });
};

module.exports.checkProductCount = id => {
  id = mongoose.Types.ObjectId(id);
  var query = { _id: id, productsAdded: { $gte: 2 } };
  return Seller.findOne(query);
};

module.exports.checkEmail = (email, callback) => {
  var query = { email: email };
  Seller.countDocuments(query, callback);
};

module.exports.verifySellerEmail = (token, callback) => {
  var query = { token: token };
  var verify = { emailVerified: true };
  Seller.findOneAndUpdate(query, verify, callback);
};

module.exports.updateStepsToDo = (sellerId, step, callback) => {
  var query = { _id: sellerId };
  var update = { stepsToDo: step };
  console.log('Updating Steps');
  //Seller.findByIdAndUpdate(query, update, callback);
  Seller.findOneAndUpdate(query, update, callback);
  //findOneAndUpdate
};

module.exports.updateToken = (email, token, callback) => {
  var query = { email: email };
  var update = { token: token };
  Seller.findOneAndUpdate(query, update, callback);
};

module.exports.updateStatus = (email, status, verified, callback) => {
  var query = { email: email };
  var update = { status: status, verified: verified };

  // if(status == "pending")
  // {
  console.log('update status');
  Seller.findOneAndUpdate(query, update, callback);
  console.log('After Update status');

  //}
};

module.exports.updatePassword = (token, password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      var query = { token: token };
      var update = { password: hash };
      Seller.findOneAndUpdate(query, update, callback);
    });
  });
};

module.exports.changePassword = (id, password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      var query = { _id: id };
      var change = { password: hash };
      Seller.findOneAndUpdate(query, change, callback);
    });
  });
};

module.exports.getSellerById = (id, callback) => {
  Seller.findById(id, callback);
  console.log(id);
};

module.exports.comparePassword = (canidatePassword, hash, callback) => {
  bcrypt.compare(canidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.getSellers = (offset = 0, size = 10, callback) => {
  Seller.find()
    .limit(size)
    .skip(offset)
    .exec(callback);
};

module.exports.getUnverifiedSeller = callback => {
  var query = { status: 'pending' };
  var select = { email: 1, shopName: 1, status: 1 };
  Seller.aggregate([
    { $match: query },
    { $project: select },
    {
      $lookup: {
        from: 'warehouseaddresses', // collection to join
        localField: '_id', //field from the input documents
        foreignField: 'seller_id', //field from the documents of the "from" collection
        as: 'warehouseaddress', // output array field
      },
    },
  ]).exec(callback);
};

module.exports.getSellerAddress = (email, callback) => {
  var query = { email: email };
  var select = { email: 1, phoneNo: 1 };
  Seller.aggregate([
    { $match: query },
    { $project: select },
    {
      $lookup: {
        from: 'businessaddresses', // collection to join
        localField: '_id', //field from the input documents
        foreignField: 'seller_id', //field from the documents of the "from" collection
        as: 'businessaddress', // output array field
      },
    },
    {
      $lookup: {
        from: 'warehouseaddresses', // collection to join
        localField: '_id', //field from the input documents
        foreignField: 'seller_id', //field from the documents of the "from" collection
        as: 'warehouseaddress', // output array field
      },
    },
  ]).exec(callback);
};

module.exports.getSellerDetails = (email, callback) => {
  var query = { email: email };
  Seller.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'warehouseaddresses', // collection to join
        localField: '_id', //field from the input documents
        foreignField: 'seller_id', //field from the documents of the "from" collection
        as: 'warehouseaddress', // output array field
      },
    },
    {
      $lookup: {
        from: 'businessaddresses', // collection to join
        localField: '_id', //field from the input documents
        foreignField: 'seller_id', //field from the documents of the "from" collection
        as: 'businessaddress', // output array field
      },
    },
    {
      $lookup: {
        from: 'idinfos', // collection to join
        localField: '_id', //field from the input documents
        foreignField: 'sellerId', //field from the documents of the "from" collection
        as: 'idInfo', // output array field
      },
    },
    {
      $lookup: {
        from: 'bankdetails', // collection to join
        localField: '_id', //field from the input documents
        foreignField: 'sellerId', //field from the documents of the "from" collection
        as: 'bankdetails', // output array field
      },
    },
  ]).exec(callback);
};

module.exports.getSellerProduct = (email, offset = 0, size = 10, callback) => {
  var query = { email: email };
  var select = { email: 1 };
  Seller.aggregate([
    { $match: query },
    { $project: select },
    {
      $lookup: {
        from: 'pendingproducts', // collection to join
        as: 'pendingproducts', // output array field
        let: { indicator_id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$sellerId', '$$indicator_id'] },
            },
          },
          { $limit: size },
          { $skip: offset },
        ],
      },
    },
    {
      $lookup: {
        from: 'products', // collection to join
        as: 'products', // output array field
        let: { indicator_id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$sellerId', '$$indicator_id'] },
            },
          },
          { $limit: size },
          { $skip: offset },
        ],
      },
    },
    {
      $lookup: {
        from: 'rejectedproducts', // collection to join
        as: 'rejectedproducts', // output array field
        let: { indicator_id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$sellerId', '$$indicator_id'] },
            },
          },
          { $limit: size },
          { $skip: offset },
        ],
      },
    },
  ]).exec(callback);
};
