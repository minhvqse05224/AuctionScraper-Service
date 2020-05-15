const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
        required:true,
    },
    link:{
        type:String,
        required:true,
    },
    seen:{
        type:Boolean,
        required:false
    }
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
