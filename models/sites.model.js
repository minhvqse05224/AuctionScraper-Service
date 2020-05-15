const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const siteSchema = new Schema({
    url:{
        type:String,
        required:true,
    }
}, {
    timestamps: true
});

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;
