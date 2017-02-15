/**
 * Created by demongao on 2017/2/14.
 */

const express = require('express')
const config = require('./../../config/default.json')
const wechat = require('wechat');
const wechat_config = {
    token: config.wx.token,
    appid: config.wx.app_id,
    encodingAESKey: config.wx.encodingAESKey
};
module.exports = wechat(wechat_config, wechat.text(function (message, req, res, next) {
    // 微信输入信息都在req.weixin上
    console.log(message)
    if (message.Content === '1') {
        // 回复屌丝(普通回复)
        res.reply('hehe');
    } else if (message.Content === '2') {
        //你也可以这样回复text类型的信息
        res.reply({
            content: 'text object',
            type: 'text'
        });
    } else if (message.Content === '3') {
        // 回复一段音乐
        res.reply({
            type: "music",
            content: {
                title: "来段音乐吧",
                description: "一无所有",
                musicUrl: "http://mp3.com/xx.mp3",
                hqMusicUrl: "http://mp3.com/xx.mp3",
                thumbMediaId: "thisThumbMediaId"
            }
        });
    } else {
        // 回复高富帅(图文回复)
        res.reply([
            {
                title: '你来我家接我吧',
                description: '这是女神与高富帅之间的对话',
                picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                url: 'http://demongao94.tunnel.2bdata.com/index'
            }
        ]);
    }
}).event(function (message, req, res, next) {
    // message为事件内容
    console.log(message.EventKey)
    switch (message.EventKey){
        case "menu" :
        {
            res.reply('' +
                '菜单 \n' +
                '1.文字回复 \n' +
                '2.text 类型回复 \n' +
                '其他:图文回复\n' +
                '\n' +
                '谢谢测试...'
            );
            break;
        }

    }

}));

