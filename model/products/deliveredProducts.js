const mongoose=require('mongoose');

var DeliveredProductSchema=mongoose.Schema({
    orderId:{
        type:mongoose.Types.ObjectId
    },
    buyerId:{
        type:mongoose.Types.ObjectId
    },
    addressId:{
        type:mongoose.Types.ObjectId
    },
    product:[
        {
            productId:{
                type:mongoose.Types.ObjectId
            },
            quantity:{
                type:Number
            },
            sellerId:{
                type:mongoose.Types.ObjectId
            },
            deliveryStatus:{
                type:Boolean,
                default:false
            }
        }
    ]
});

var DeliveredProduct=module.exports=mongoose.model('DeliveredProduct',DeliveredProductSchema);

module.exports.addDeliveredProduct=(newDeliveredProduct,callback)=>{
    newDeliveredProduct.save(callback);
}

module.exports.updateProductStatus=(orderId,productId,callback)=>{
    orderId=mongoose.Types.ObjectId(orderId);
    productId=mongoose.Types.ObjectId(productId);
    var query={orderId:orderId,'product.productId':productId};
    var update={$set:{'product.$.deliveryStatus':true}};
    Order.findOneAndUpdate(query,update,callback);
}

module.exports.updateStatus=(sellerId,callback)=>{
    var query={'product.sellerId':sellerId};
    var update={'product.deliveryStatus':true};
    DeliveredProduct.updateOne(query,update,callback);
}