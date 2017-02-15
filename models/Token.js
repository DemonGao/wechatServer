/**
 * Created by demongao on 2017/2/15.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var TokenSchema = new Schema({
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    openid: String,
    scope: String,
    create_at: String
});
//自定义getToken方法
TokenSchema.statics.getToken = function (openid, cb) {
    this.findOne({openid:openid}, function (err, result) {
        if (err) throw err;
        return cb(null, result);
    });
};
//自定义saveToken方法
TokenSchema.statics.setToken = function (openid, token, cb) {
    // 有则更新，无则添加
    var query = {openid: openid};
    var options = {upsert: true};
    this.update(query, token, options, function (err, result) {
        if (err) throw err;
        return cb(null);
    });
};
mongoose.model('Token', TokenSchema);