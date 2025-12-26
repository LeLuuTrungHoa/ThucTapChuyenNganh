const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HoadonSchema = new Schema({
    namekh: {
        type: String,
        required: true,
    },
    sdtkh: {
        type: String,
        required: false,
    },
    loaixe: {
        type: String,
        required: false,
    },
    ngaytaohd: {
        type: Date,
        default: Date.now,
    },
    // Lưu danh sách dịch vụ đc chọn
    dichvus: [{
        type: Schema.Types.ObjectId,
        ref: 'dichvus'
    }],
    // Lưu danh sách  sản phẩm đc chọn
    sanphams: [{
        type: Schema.Types.ObjectId,
        ref: 'sanphams'
    }],
    tienhd: {
        type: Number,
        required: true,
        default: 0
    },
    trangthaihd: {
        type: String,
        enum: ['Chưa thanh toán', 'Đã thanh toán', 'Đã hủy'],
        default: 'Chưa thanh toán'
    },
    phuongthuc: {
        type: String,
        default: 'Tiền mặt'
    }
});

module.exports = mongoose.models.hoadons || mongoose.model('hoadons', HoadonSchema);