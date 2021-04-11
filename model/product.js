var mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
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
        flammable: {
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
    totalHits: {
        type: Number,
        default: 0
    },
    productImage: {
        type: Array
    },
    creationDate: {
        type: Number
    }
});

var Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.addProduct = (newProduct, callback) => {
    newProduct.save(callback);
}

module.exports.findProductByIdForBuyer = (id, callback) => {
    //console.log("module.exports.findProductById");
    Product.findByIdAndUpdate(id, { $inc: { totalHits: 1 } }, callback);
//     var query = { _id: id };
//     Product.aggregate([ {$match: query}  ,
//         {   $lookup: {
//                 from: "categories", // collection to join
//                 localField: "categoryLevels.level1",//field from the input documents
//                 foreignField: "_id",//field from the documents of the "from" collection
//                 as: "categories"// output array field
//                 }
//         } //, { $inc: { totalHits: 1} }
// ]).exec(callback);
}

module.exports.findProduct = (id, callback) => {
    var query = { sellerId: id };
    Product.findOne(query, callback);
}

module.exports.findProductById = (id, sellerId) => {
    console.log("id", sellerId);
    id = mongoose.Types.ObjectId(id);
    sellerId = mongoose.Types.ObjectId(sellerId);
    var query = { _id: id, sellerId: sellerId };
    return Product.findOne(query);
}

module.exports.getSellerProducts = (id, callback) => {
    id = mongoose.Types.ObjectId(id);
    var query = { sellerId: id };
    Product.aggregate([{ $match: query },
    {
        $lookup: {
            from: 'productreviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'productReviews'
        }
    }, { $project: { productReviews: 1 } }
    ]).exec(callback);
}

module.exports.updateProduct = (id, product) => {
    id = mongoose.Types.ObjectId(id);
    return Product.findByIdAndUpdate(id, product);
}

module.exports.getSellerProduct = (id, offset = 0, size = 10, callback) => {
    var query = { sellerId: id };
    Product.find(query).limit(size).skip(offset).exec(callback);
}

module.exports.getProducts = (offset = 0, size = 10, callback) => {
    Product.find().limit(size).skip(offset).exec(callback);
}

module.exports.searchProductByName = (productName, offset = 0, size = 10, callback) => {
    var query = { name: productName };
    Product.find(query).limit(size).skip(offset).exec(callback);
}

module.exports.getLevel1Products = (categoryId, offset = 0, size = 10, callback) => {
    console.log(''+ categoryId)
    var query = { 'categoryLevels.level1': categoryId };
    Product.find(query).limit(size).skip(offset).exec(callback);
}

module.exports.getLevel2Products = (categoryId, offset = 0, size = 10, callback) => {
    var query = { 'categoryLevels.level2': categoryId };
    Product.find(query).limit(size).skip(offset).exec(callback);
}

module.exports.getLevel3Products = (categoryId, offset = 0, size = 10, callback) => {
    var query = { 'categoryLevels.level3': categoryId };
    Product.find(query).limit(size).skip(offset).exec(callback);
}

module.exports.getTrendingProducts = (callback) => {
    var sort = { totalHits: -1 };
    Product.find().sort(sort).exec(callback);
}

//SS-CHANGED
module.exports.getNewProducts = (callback) => {
    var sort = { creationDate: -1 };
    Product.find().sort(sort).limit(10).exec(callback);
}

//SS-CHANGED
module.exports.getNewProducts = (callback) => {
    var sort = { creationDate: -1 };
    Product.find().sort(sort).limit(10).exec(callback);
}
