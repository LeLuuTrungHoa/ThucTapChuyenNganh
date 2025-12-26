const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DichvuSchema = new Schema({
    imagedv: {
        type:String,
        default:'https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-9/185123341_298069835358873_2334992459436833472_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeGiRz5unoFuO8SJ9r0xLty9LMrL0A1MrdMsysvQDUyt00wxd3UJkRB4Dn-WU2EfL_VRtkduKW9GRSbGHbgV5FQc&_nc_ohc=4H_PqDp2DsYQ7kNvwFN0pWp&_nc_oc=AdlLN4CCSs5GoH-Y-9aPNiAnds6WMOdKR7r1EUtQpt-GXm1aQgr6JQMcyFeGe1k8-wf6f2_HqqM-J3sP8sARkeZ9&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=byLXVP3m-GBQ8YiCYwbjVg&oh=00_AfmIJ8C-FD6ZjReRCUNVunxikjO0WUIRJ2XjixojHo1UHQ&oe=6974D0FA',
        required: false,
    },
    namedv: {
        type:String,
        required:true,
    },
    motadv: {
        type:String,
        required:true,
    },
    giadv: {
        type:String,
        required:true,
    },
});

module.exports = mongoose.models.dichvus || mongoose.model('dichvus', DichvuSchema);