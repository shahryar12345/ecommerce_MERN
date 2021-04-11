const mongoose=require('mongoose');

var BuyerAddressSchema=mongoose.Schema({
    buyerId:{
        type:mongoose.Types.ObjectId,
        index:true
    },
    province:{
        type:String
    },
    city:{
        type:String
    },
    area:{
        type:String
    },
    address:{
        type:String
    }
});

var BuyerAddress=module.exports=mongoose.model('BuyerAddress',BuyerAddressSchema);

module.exports.addAddress=(newAddress,callback)=>{
    newAddress.save(callback);
}