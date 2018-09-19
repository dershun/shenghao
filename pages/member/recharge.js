// pages/member/recharge.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tins = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          tins.setData({
            userinfo: res.data,
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 立即充值
   */
  formSubmit: function (e){
    var tal = this;
    var value = e.detail.value;
    var userinfo = this.data.userinfo;
    var submit = true;
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg.test(value.number) || value.number <= 1 ) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    }
    
    if (submit) {
      // 提交充值
      wx.request({
        url: util.realm_name + 'api.php?c=Order&a=chongzhiorder',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          uid: userinfo.id,
          order_price: value.number,
        },
        success: function (res) {
          if (res.data.code == 200) {
            var datas = res.data.data;
            datas.openid = userinfo.openid;

            tal.pay(datas);//调用支付
          } else if (res.data.code == 100) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })

    }
  },

  /**
   * 支付
   */
  pay: function (data) {
    wx.request({
      url: util.realm_name + 'api.php?c=Wechatpay&a=public_jsapipay',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: data,
      success: function (osg) {
        if (osg.statusCode == 200) {
          var datass = osg.data;
          if (datass.code == 200) {
            wx.requestPayment({
              'timeStamp': datass.data.timeStamp,
              'nonceStr': datass.data.nonceStr,
              'package': datass.data.package,
              'signType': 'MD5',
              'paySign': datass.data.paySign,
              'success': function (s) {
                wx.navigateTo({
                  url: '/pages/prompt/buyok'
                })
              },
              'fail': function (s) {
                wx.navigateTo({
                  url: '/pages/prompt/payerror'
                })
              }
            })
          }
        }
      }
    })
  },
})