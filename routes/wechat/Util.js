/**
 * Created by demongao on 2017/2/14.
 */
var fs = require('fs')
const express = require('express')
var router = express.Router();
const config = require('./../../config/default.json')   //配置文件
const app_id      = config.wx.app_id;
const app_secret  = config.wx.app_secret;
const domain = config.domain;
const API = require('wechat-api')           //微信公共平台Node库 API
var api = new API(app_id, app_secret, getToken, saveToken );
const OAuth = require('wechat-oauth');      //微信公共平台OAuth接口消息接口服务中间件与API SDK
var client = new OAuth(app_id, app_secret); //微信授权和回调



//创建菜单
router.get('/creatmenu', function(req, res, next) {
    const menu_config = config.wx.wx_menu;
    api.createMenu(menu_config, function(err, result){
        res.send(menu_config);
        console.log(err);
        if(err){
            res.send({result:false,err_msg:err});
        }else{
            res.send({result:true,data:result});
        }
    });

});


// 主页,主要是负责OAuth认证
router.get('/index', function(req, res) {
    var url = client.getAuthorizeURL('http://' + domain + '/callback','','snsapi_userinfo');
    res.redirect(url)
})

/**
 * 认证授权后回调函数
 *
 * 根据openid判断是否用户已经存在
 * - 如果是新用户，注册并绑定，然后跳转到手机号验证界面
 * - 如果是老用户，跳转到主页
 */
router.get('/callback', function(req, res) {
    console.log('----weixin callback -----')
    var code = req.query.code;

    // var User = req.model.UserModel;

    client.getAccessToken(code, function (err, result) {
        console.log(err)
        console.log(result)
        var accessToken = result.data.access_token;
        var openid = result.data.openid;

        console.log('token=' + accessToken);
        console.log('openid=' + openid);
        res.redirect('/');
        // User.find_by_openid(openid, function(err, user){
        //     console.log('微信回调后，User.find_by_openid(openid) 返回的user = ' + user)
        //     if(err || user == null){
        //         console.log('user is not exist.')
        //         client.getUser(openid, function (err, result) {
        //             console.log('use weixin api get user: '+ err)
        //             console.log(result)
        //             var oauth_user = result;
        //
        //             var _user = new User(oauth_user);
        //             _user.username = oauth_user.nickname;
        //             _user.nickname = oauth_user.nickname;
        //
        //             _user.save(function(err, user) {
        //                 if (err) {
        //                     console.log('User save error ....' + err);
        //                 } else {
        //                     console.log('User save sucess ....' + err);
        //                     req.session.current_user = void 0;
        //                     res.redirect('/user/' + user._id + '/verify');
        //                 }
        //             });
        //
        //         });
        //     }else{
        //         console.log('根据openid查询，用户已经存在')
        //         // if phone_number exist,go home page
        //         if(user.is_valid == true){
        //             req.session.current_user = user;
        //             res.redirect('/mobile')
        //         }else{
        //             //if phone_number exist,go to user detail page to fill it
        //             req.session.current_user = void 0;
        //             res.redirect('/users/' + user._id + '/verify');
        //         }
        //     }
        // });
    });
});
// //获取 jsapi 签名
// var signature = require('wx_jsapi_sign');
// var signature_config ={
//     appId: config.wx.app_id,
//     appSecret: config.wx.app_secret,
//     appToken: config.wx.token,
//     cache_json_file:'/tmp'
// }
//
// router.get('/getsignature', function(req, res){
//     // var url = req.body.url;
//     var url = req.query.url;
//     console.log(url);
//     signature.getSignature(signature_config)(url, function(error, result) {
//         if (error) {
//             res.json({
//                 'error': error
//             });
//         } else {
//             res.json(result);
//         }
//     });
// });
module.exports = router;

//-------------------基础 access_token -------------------
/***
 * 全局获取 token 方法
 * token 在微信接口中被限制次数 2000,所以要节省
 * @param callback
 */
function getToken(callback){
    // 传入一个获取全局token的方法
    fs.readFile('access_token.txt', 'utf8', function (err, txt) {
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}
/***
 * 全局保存 token 方法
 * @param token
 * @param callback
 */
function saveToken(token, callback){
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('access_token.txt', JSON.stringify(token), callback);
}

//-------------------OAuth access_token -------------------
