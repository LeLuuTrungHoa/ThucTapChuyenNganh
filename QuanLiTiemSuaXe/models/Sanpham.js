const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SanphamSchema = new Schema({
    imagesp:{
        type:String,
        required:true,
    },
    namesp: {
        type:String,
        required:true,
    },
    motasp: {
        type:String,
        required:true,
    },
    giasp: {
        type:String,
        required:true,
    },
    soluongsp: {
        type:Number,
        required:true,
    },
});

module.exports = mongoose.models.sanphams || mongoose.model('sanphams', SanphamSchema);