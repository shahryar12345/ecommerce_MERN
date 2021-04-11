var mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var PendingSchema = mongoose.Schema({
    email:{
        type:String,
        //index:true
    },
    ownerName:{
        type:String
    },
    sellerId:{
        type:mongoose.Schema.ObjectId,
        //unique:false
    },
    phoneNo:{
        type:Number
    },
    accountType:{
        type:String
    },
    shopName:{
        type:String
    },
    shopLocation:{
        type:String
    },
    role:{
        type:String
    },
    verified:{
        type:Boolean
    },
    emailVerified:{
        type:Boolean
    },
    token:{
        type:String
    },
    status:{
        type:String
    },
    stepsToDo:{
        type:Number
    }
});
PendingSchema.plugin(uniqueValidator);
var PendingSeller=module.exports=mongoose.model('PendingSeller',PendingSchema);

module.exports.addSeller=(newPendingSeller,callback)=>{
    newPendingSeller.save(callback);
}

module.exports.findSeller=(sellerEmail,callback)=>{
    var query={email:sellerEmail};
    PendingSeller.findOne(query,callback);
}

module.exports.getSeller=(offset=0,size=10,callback)=>{
    var select={email:1,shopName:1,status:1,sellerId:1};
    PendingSeller.aggregate([{$project:select},
        {$lookup: {
            from: "businessaddresses", // collection to join
            localField: "sellerId",//field from the input documents
            foreignField: "seller_id",//field from the documents of the "from" collection
            as: "businessAddress"// output array field
        }},
        {$lookup: {
            from: "idinfos", // collection to join
            localField: "sellerId",//field from the input documents
            foreignField: "sellerId",//field from the documents of the "from" collection
            as: "identityInformation"// output array field
        }},
        {$lookup: {
            from: "bankdetails", // collection to join
            localField: "sellerId",//field from the input documents
            foreignField: "sellerId",//field from the documents of the "from" collection
            as: "bankDetails"// output array field
        }}
    ]).limit(size).skip(offset).exec(callback);
}

module.exports.getSellerDetails=(email,callback)=>{
    var query={email:email};
    PendingSeller.aggregate([{$match:query},
        {$lookup: {
            from: "warehouseaddresses", // collection to join
            localField: "sellerId",//field from the input documents
            foreignField: "seller_id",//field from the documents of the "from" collection
            as: "warehouseaddress"// output array field
        }},{$lookup: {
            from: "businessaddresses", // collection to join
            localField: "sellerId",//field from the input documents
            foreignField: "seller_id",//field from the documents of the "from" collection
            as: "businessaddress"// output array field
        }},{$lookup: {
            from: "idinfos", // collection to join
            localField: "sellerId",//field from the input documents
            foreignField: "sellerId",//field from the documents of the "from" collection
            as: "idInfo"// output array field
        }},{$lookup: {
            from: "bankdetails", // collection to join
            localField: "sellerId",//field from the input documents
            foreignField: "sellerId",//field from the documents of the "from" collection
            as: "bankdetails"// output array field
        }}
    ]).exec(callback);
}

module.exports.deleteSeller=(email,callback)=>{
    var query={email:email};
    PendingSeller.deleteOne(query,callback);
}