// pages/zhongcou/index.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //banner
    wx.request({
      url: util.realm_name + 'api.php?c=Index&a=bannerlist',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            imgUrls: res.data.data
          })
        }
      }
    })
    
    this.goodslist(1);
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
    
    var p = this.data.p + 1;
    this.goodslist( p);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 商品列表
   */

  goodslist: function (p) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    // 商品
    wx.request({
      url: util.realm_name + 'api.php?c=goods&a=zcgoodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        p: p,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode == 200){
          if (res.data.code == 200) {
            if (p > 1) {
              var goodslist = that.data.goodslist.concat(res.data.data);
            } else {
              var goodslist = res.data.data;
            }
            that.setData({
              goodslist: goodslist,
              p: p
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }else{
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
})