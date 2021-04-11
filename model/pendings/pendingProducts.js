var mongoose = require('mongoose');

var PendingProductSchema = mongoose.Schema({
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
    warrantyType: {
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
    }],
    productImage: {
        type: Array
    },
    creationDate: {
        type: Number
    }
});

var PendingProduct = module.exports = mongoose.model('PendingProduct', PendingProductSchema);

module.exports.addPendingProduct = (newPendingProduct, callback) => {
    newPendingProduct.save(callback);
}

module.exports.getProduct = (offset, size, callback) => {
    PendingProduct.find().limit(size).skip(offset).exec(callback);;
}

module.exports.getProductById = (id, callback) => {
    var query = { id: id };
    PendingProduct.findById(id, callback);
}

module.exports.findProductById = (id, sellerId) => {
    console.log("id", sellerId);
    id = mongoose.Types.ObjectId(id);
    sellerId = mongoose.Types.ObjectId(sellerId);
    var query = { _id: id, sellerId: sellerId };
    return PendingProduct.findOne(query);
}

module.exports.updateProduct = (id, product) => {
    id = mongoose.Types.ObjectId(id);
    return PendingProduct.findByIdAndUpdate(id, product);
}

module.exports.getSellerProducts = (sellerId, offset = 0, size = 10, callback) => {
    console.log("offset" + offset + " size" + size);
    var query = { sellerId: sellerId };
    PendingProduct.find(query).limit(size).skip(offset).exec(callback);
}

module.exports.deleteProduct = (id, callback) => {
    var query = { id: id };
    PendingProduct.findByIdAndDelete(id, callback);
}

module.exports.updateProductById = (id, status, callback) => {
    var update = { status: status };
    PendingProduct.findByIdAndUpdate(id, update, callback);
}