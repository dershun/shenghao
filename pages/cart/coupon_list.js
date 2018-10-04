// pages/cart/coupon_list.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //总价格
    wx.getStorage({
      key: 'total',
      success: function (res) {
        that.setData({
          total: res.data,
          postage: options.postage,
        })
      }
    })

    
    //会员信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          userinfo: res.data,
        })
       
        // 获取优惠卷
        wx.request({
          url: util.realm_name + 'api.php?c=Cart&a=member_coupon_list',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            member_id: res.data.id,
            total: that.data.total,
            postage: options.postage,
            coupon: options.coupon,
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
      key: 'couponinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          that.setData({
            couponinfo: res.data,
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
    var postage = this.data.postage;
    if (value > 0 ){
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
            if (data.coupon_type == 3) {
              var postages = (postage * 1) - (data.price * 1);
              postages = postages.toFixed(2);
              if (postages < 0) {
                postages = 0;
              }
              data['postage'] = postages;
            } else {
              data['postage'] = postage;
            }
            wx.setStorage({
              key: "couponinfo",
              data: data
            });
            wx.navigateBack({
              delta: -1
            });
          }
        }
      })
    }else{
      var data = {};
      data['id'] = 0;
      data['price'] = 0;
      data['postage'] = postage;
      wx.setStorage({
        key: "couponinfo",
        data: data
      });
      wx.navigateBack({
        delta: -1
      });
    }
    
    
  },

})