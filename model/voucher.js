const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var VoucherSchema = mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String,
        unique: true
    },
    discountType: {
        type: String
    },
    minimumValue: {
        type: Number
    },
    totalVouchers: {
        type: Number
    },
    discountValue: {
        type: Number
    },
    usagePerCustomer: {
        type: Number
    },
    applyTo: {
        type: String
    },
    items: {
        type: Array
    },
    maximumDiscount: {
        type: Number
    },
    validTill: {
        type: Date
    },
    sellerId: {
        type: mongoose.Types.ObjectId
    },
    status: {
        type: String,
        default: 'Active'
    }
});
VoucherSchema.plugin(uniqueValidator);
var Voucher = module.exports = mongoose.model('Voucher', VoucherSchema);

module.exports.addVoucher = (newVoucher, callback) => {
    newVoucher.save(callback);
}

module.exports.updateStatus = (id, status, callback) => {
    id = mongoose.Types.ObjectId(id);
    Voucher.findByIdAndUpdate(id, { status: status }, callback);
}

module.exports.getVouchers = (sellerId, callback) => {
    sellerId = mongoose.Types.ObjectId(sellerId);
    Voucher.find({ sellerId: sellerId }, callback);
}

module.exports.updateVoucher = (id, voucher, callback) => {
    id = mongoose.Types.ObjectId(id);
    Voucher.findByIdAndUpdate(id, voucher, callback);
}