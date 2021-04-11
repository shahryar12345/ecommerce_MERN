var mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const uniqueArrayPlugin = require('mongoose-unique-array');

var CategorySchema=mongoose.Schema({
    name:{
        type:String,
        index:true,
        unique:true
    },
    commission:{
        type:Number
    },
    subCategories:[{
        name:{
            type:String,
            unique:true,
            sparse:true
        },
        subCategories:[{
            name:{
                type:String,
                unique:true,
                sparse:true
            }
        }]
    }]
});

CategorySchema.plugin(uniqueValidator);
CategorySchema.plugin(uniqueArrayPlugin);
var category=module.exports=mongoose.model('Category',CategorySchema);

module.exports.addCategory=(newCategory,callback)=>{
    newCategory.save(callback);
}

module.exports.addSubCategory=(name,subCatName,newCategory,callback)=>{
    var query={name:name,'subCategories.name':{$ne:subCatName}};
    var add={subCategories:newCategory};
    category.findOneAndUpdate(query,{$push:add},callback);
}

module.exports.findCategory=(offset=0,size=10,callback)=>{
    category.find().limit(size).skip(offset).exec(callback);
}

module.exports.addSubSubCategory=(subCatName,newCategory,name,callback)=>{
    var query={'subCategories.name':name,'subCategories.subCategories.name':{$ne:subCatName}};
    var add={'subCategories.$.subCategories':newCategory};
    category.findOneAndUpdate(query,{$push:add},callback);
}

module.exports.getCategories=(level1,level2=null,level3=null,callback)=>{
    var query;
    if(level2==null&&level3==null){
        query={_id:level1};
        var fields={subCategories:0};
        category.findOne(query,fields,callback);
    }
    else if(level2!=null&&level3==null){
        query={_id:level1,'subCategories._id':level2};
        console.log(level2);
        var fields={'subCategories.$':1,name:1};
        category.findOne(query,fields,callback);
    }
    else if(level2!=null&&level3!=null){
        query={_id:level1,'subCategories._id':level2,'subCategories.subCategories._id':level3};
        var fields={'subCategories.subCategories._id.$[]':1,name:1};
        category.findOne(query,fields,callback);
    }
}

module.exports.getCategoryId=(catName,callback)=>{
    var query={name:catName};
    var fields={subCategories:0};
    category.findOne(query,fields,callback);
}

module.exports.getSubCategoryId=(catName,subCatName,callback)=>{
    var query={name:catName,'subCategories.name':subCatName};
    var fields={'subCategories.$':1};
    category.findOne(query,fields,callback);
}
