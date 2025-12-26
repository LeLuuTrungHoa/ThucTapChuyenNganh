const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LichhenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    name: String,
    email: String,
    number: String,
    ngayden: String,
    gioden: String,
    subject: String, // loai xe
    message: String,
    status: { type: String, default: 'Chờ xác nhận' },
    ngaydat: { type: Date, default: Date.now },
    // xoa tu dong
    expireAt: {
        type: Date,
        default: null
    },

});
// Tạo Index : Tự động xóa sau 7 ngày (7 * 24 * 60 * 60 = 604800 giây)
// Index sẽ dõi trường 'expireAt'
LichhenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 604800 });
module.exports = mongoose.models.lichhens || mongoose.model('lichhens', LichhenSchema);