const mongoose=require('mongoose');

var LogSchema=mongoose.Schema({
    status:{
        type:String
    },
    message:{
        type:String
    },
    data:{
        type:String
    },
    userId:{
        type:mongoose.Types.ObjectId,
        index:true
    }
});

var Log=module.exports=mongoose.model('Log',LogSchema);

module.exports.addLog=(newLog)=>{
    return newLog.save();
}