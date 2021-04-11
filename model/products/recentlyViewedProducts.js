const mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const uniqueArrayPlugin = require('mongoose-unique-array');
var moment=require('moment');

var RecentlyViewdProductsSchema=mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        unique:false,
        index:true
    },
    buyerId:{
        type:mongoose.Schema.ObjectId,
        unique:false,
        index:true
    },
    LastViewedDateTime: {
        type: Number
    }
});
RecentlyViewdProductsSchema.plugin(uniqueValidator);
RecentlyViewdProductsSchema.plugin(uniqueArrayPlugin);
var RecentlyViewdProducts=module.exports=mongoose.model('RecentlyViewdProducts',RecentlyViewdProductsSchema);

module.exports.addProduct=(productId, buyerID , LastViewedDateTime ,callback)=>{
    //var d=new Date();
    var query={productId:productId , buyerId : buyerID};   
    //Object which will added
    var RecentlyViewdProduct = {
        productId: productId,
        buyerId : buyerID ,
        LastViewedDateTime : LastViewedDateTime
    };

    var options = { upsert: true};
    RecentlyViewdProducts.findOneAndUpdate(query,RecentlyViewdProduct,options,callback);
    // RecentlyViewdProducts.findOneAndUpdate(query,RecentlyViewdProduct,options,(err,product)=>{
    //     console.log(product)
    //     if(err)
    //     {
    //         console.log(err)
    //     }
    //     console.log('module.exports.addProduct() Recently View Data')
    //     console.log(product)
    //     });
}

module.exports.getProduct=( buyerId , callback)=>{
    var buyer_ID = mongoose.Types.ObjectId(buyerId);
    var sort={'LastViewedDateTime':-1};
    var query  = {buyerId : buyer_ID};
    console.log('buyerID : ' + buyer_ID);
    RecentlyViewdProducts.aggregate([ { $match : query},
        {$lookup: {
            from: "products", // collection to join
            localField: "productId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "products"// output array field
        }}
    ]).sort(sort).exec(callback);
}
