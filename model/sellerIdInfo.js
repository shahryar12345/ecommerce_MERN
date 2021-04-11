var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var idInfoSchema = mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  idType: {
    type: String,
    required: true,
  },
  nameOnId: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  idFrntImg: {
    data: Buffer,
    contentType: String,
  },
  idBckImg: {
    data: Buffer,
    contentType: String,
  },
});
idInfoSchema.plugin(uniqueValidator);
var idInfo = (module.exports = mongoose.model('SellerIdInfo', idInfoSchema));

module.exports.addData = (sellerId, newIdInfo, callback) => {
  console.log('hello');
  var query = { sellerId: sellerId };
  var options = { upsert: true };
  idInfo.findOneAndUpdate(query, newIdInfo, options, callback);
};

module.exports.getIdInfo = (id, callback) => {
  var query = { sellerId: id };
  console.log(id);
  idInfo.findOne(query, callback);
};
