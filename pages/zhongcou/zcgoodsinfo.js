// pages/goods/goodsinfo.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isix: app.globalData.isix,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goodsinfo: {},
    price: 0,
    total:0,
    number:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;

    //会员信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          that.setData({
            userinfo: res.data,
          })
        }
      }
    })

    // 商品
    wx.request({
      url: util.realm_name +'api.php?c=Goods&a=zcgoodsinfo',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        id: options.id,
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          var no_disabled = false;
          if (res.data.data.paydata.days_remaining == 0){
            var no_disabled = true;
          }
          that.setData({
            goodsinfo: res.data.data,
            price: res.data.data.price,
            no_disabled: no_disabled,
            realm_name: util.realm_name,
          })
        }else{
          wx.showToast({
            title: '商品已下架',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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
   * 选择价格档
   */
  xuandang:function(es){
    var id = es.currentTarget.dataset.id;
    var pay = es.currentTarget.dataset.pay;
    this.setData({
      xuandang: id,
      price: pay,
    })
  },

  /**
   * 立即购买
   */
  buy: function (event) {
    var id = event.currentTarget.dataset.id;
    var number = this.data.number;
    var price = this.data.price;
    var xuandang = this.data.xuandang;
    var is_to = true;

    var userinfo = this.data.userinfo;//会员信息
   
    if (!userinfo) {
      wx.showModal({
        title: '提示',
        content: '您还未登陆，立即登陆？',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/member/index'
            })
          }
        }
      })
      is_to = false;
    }else if (!xuandang) {
      wx.showToast({
        title: '请选择价格档位',
        icon: 'none',
        duration: 2000
      })
      is_to = false;
    } else {
      var goodsbill = {};
      goodsbill[id] = number;
      var price_spec = xuandang;
    }

    if (is_to) {
      wx.setStorage({
        key: "goodsbill",
        data: goodsbill
      });

      wx.setStorage({
        key: "price_spec",
        data: price_spec
      });

      wx.setStorage({
        key: "total",
        data: price
      });

      wx.navigateTo({
        url: '/pages/cart/jiesuan?type=2'
      })
    }

  },
  
})