var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var bankDetailsSchema = mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  branchCode: {
    type: String,
    required: true,
  },
  chequeCopy: {
    data: Buffer,
    contentType: String,
  },
});
bankDetailsSchema.plugin(uniqueValidator);
var bankDetails = (module.exports = mongoose.model('SellerBankDetail', bankDetailsSchema));

module.exports.addData = (sellerId, newBankDetails, callback) => {
  console.log('hello');
  var query = { sellerId: sellerId };
  var options = { upsert: true };
  bankDetails.findOneAndUpdate(query, newBankDetails, options, callback);
};

module.exports.getBankDetails = (id, callback) => {
  var query = { sellerId: id };
  console.log(id);
  bankDetails.findOne(query, callback);
};
