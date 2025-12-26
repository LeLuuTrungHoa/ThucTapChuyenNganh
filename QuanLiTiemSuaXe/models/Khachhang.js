const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const KhachhangSchema = new Schema({
    namekh: {
        type:String,
        required:true,
    },
    sdtkh: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    avatarUrl: {
        type: String,
        default: '/images/faces/default-customer.jpg'
    }
});

module.exports = mongoose.models.khachhangs || mongoose.model('khachhangs', KhachhangSchema);