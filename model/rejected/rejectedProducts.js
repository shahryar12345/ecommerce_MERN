var mongoose = require('mongoose');

var RejectedProductSchema = mongoose.Schema({
    name: {
        type: String
    },
    brand: {
        type: String
    },
    model: {
        type: String
    },
    highlights: {
        type: String
    },
    description: {
        type: String
    },
    warantyType: {
        type: String
    },
    dangerousGoods: {
        battery: {
            type: Boolean,
            default: false
        },
        famable: {
            type: Boolean,
            default: false
        },
        liquid: {
            type: Boolean,
            default: false
        }
    },
    whatsInTheBox: {
        type: String
    },
    packageWeight: {
        type: Number
    },
    packageDimensions: {
        length: {
            type: Number
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        }
    },
    categoryLevels: {
        level1: {
            type: mongoose.Schema.ObjectId
        },
        level2: {
            type: mongoose.Schema.ObjectId
        },
        level3: {
            type: mongoose.Schema.ObjectId
        }
    },
    status: {
        type: String
    },
    sellerId: {
        type: mongoose.Schema.ObjectId
    },
    SKU: [{
        availability: {
            type: Boolean
        },
        variation: {
            type: Array
        },
        sellerSKU: {
            type: String
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        specialPrice: {
            type: Number
        }
    }]
});

var RejectedProduct = module.exports = mongoose.model('RejectedProduct', RejectedProductSchema);

module.exports.addRejectedProduct = (newRejectedProduct, callback) => {
    newRejectedProduct.save(callback);
}

module.exports.getSellerProducts = (sellerId, offset = 0, size = 10, callback) => {
    var query = { sellerId: sellerId };
    RejectedProduct.find(query).limit(size).skip(offset).exec(callback);
}

module.exports.findProductById = (id, sellerId) => {
    console.log("id", sellerId);
    id = mongoose.Types.ObjectId(id);
    sellerId = mongoose.Types.ObjectId(sellerId);
    var query = { _id: id, sellerId: sellerId };
    return RejectedProduct.findOne(query);
}

module.exports.updateProduct = (id, product) => {
    id = mongoose.Types.ObjectId(id);
    return RejectedProduct.findByIdAndUpdate(id, product);
}