// pages/Member/coupon_list.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recharge_coupon_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var number = options.number;
    var that = this;

    //会员信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          userinfo: res.data,
        })

        // 获取优惠卷
        wx.request({
          url: util.realm_name + 'api.php?c=Member&a=recharge_coupon_list',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            member_id: res.data.id,
            number: number,
          },
          success: function (res) {
            if (res.data.code == 200) {
              that.setData({
                couponlist: res.data.data,
              })
            }
          }
        })
      }
    });

    //优惠卷信息
    wx.getStorage({
      key: 'rechargecoupon',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          that.setData({
            rechargecoupon: res.data,
          })
        }
      }
    })
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
   * 选择优惠卷
   */
  pickeraddress: function (e) {
    var value = e.detail.value;
    if (value > 0) {
      // 优惠卷信息
      wx.request({
        url: util.realm_name + 'api.php?c=Cart&a=get_member_coupon',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          coupon_id: value,
        },
        success: function (res) {
          if (res.data.code == 200) {
            var data = res.data.data;
            wx.setStorage({
              key: "rechargecoupon",
              data: data
            });
            wx.navigateBack({
              delta: -1
            });
          }
        }
      })
    } else {
      var data = {};
      data['id'] = 0;
      data['price'] = 0;
      data['coupon_type'] = 2;
      wx.setStorage({
        key: "rechargecoupon",
        data: data
      });
      wx.navigateBack({
        delta: -1
      });
    }
   
  },

})