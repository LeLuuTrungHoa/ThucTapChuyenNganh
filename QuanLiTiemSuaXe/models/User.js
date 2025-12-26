const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: {
        type:String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    avatarUrl: {
        type: String,
        default: '/images/faces/hoa.jpg'
    },
    role: {
        type: String,
        default: 'customer',
        enum: ['customer', 'admin']
    },
});

module.exports = mongoose.models.users || mongoose.model('users', UserSchema);