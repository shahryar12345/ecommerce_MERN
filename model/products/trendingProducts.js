const mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const uniqueArrayPlugin = require('mongoose-unique-array');
var moment=require('moment');

var TrendingProductSchema=mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        unique:true,
        index:true
    },
    Days:[
        {
            hits:{
                type:Number,
                default:0,
            },
            Date:{
                type:Number
            }
        }
    ]
});
TrendingProductSchema.plugin(uniqueValidator);
TrendingProductSchema.plugin(uniqueArrayPlugin);
var TrendingProduct=module.exports=mongoose.model('TrendingProduct',TrendingProductSchema);

module.exports.addProduct=(productId,product,callback)=>{
    var d=new Date();
    var query={productId:productId};
    var query2={productId:productId,'Days.Date':d.getDate()};
    var fields={'Days.$':1};
    var options = { upsert: true};
    TrendingProduct.findOneAndUpdate(query,product,options,(err,product)=>{
        TrendingProduct.findOne(query2,fields,(err,trend)=>{
            if(trend===null){
                console.log('hello');
                TrendingProduct.findOneAndUpdate(query,{$push:{Days:{hits:1,Date:d.getDate()}}},options,callback);
            }
            else if(trend.Days[0].Date===d.getDate()){
                TrendingProduct.findOneAndUpdate(query,{$set:{Days:{hits:trend.Days[0].hits+1,Date:d.getDate()}}},options,callback);
            }
        });
    });
}

module.exports.getProduct=(callback)=>{
    var d=new Date();
    var date=d.getDate();
    //if(date!=1) date-=1; // Discuss This
    var query={'Days.Date': date};
    //console.log('module.exports.getProduct=(callback)=>{  called')
    //console.log('date : ' + date)
    var sort={'Days.hits':-1};
    TrendingProduct.aggregate([{$unwind:'$Days'},{ $match : query},
        {$lookup: {
            from: "products", // collection to join
            localField: "productId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "products"// output array field
        }}
    ]).sort(sort).exec(callback);
}
