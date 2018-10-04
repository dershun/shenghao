// pages/goods/goodsinfo.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goodsinfo:{},
    cartsarr: [],
    cartsall: {},
    number: 1,
    stock: 0,
    price:0,
    isix: app.globalData.isix,
    model: app.globalData.model,
    recommendgoods:[],
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

    
    //购物车对象
    wx.getStorage({
      key: 'cartsall',
      success: function (res) {
        that.setData({
          cartsall: res.data
        })
      }
    })

    //购物车数组
    wx.getStorage({
      key: 'cartsarr',
      success: function (res) {
        that.setData({
          cartsarr: res.data
        })
      }
    })

    // 商品
    wx.request({
      url: util.realm_name +'api.php?c=Goods&a=goodsinfo',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        id: options.id,
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            goodsinfo: res.data.data,
            stock: res.data.data.stock,
            price: res.data.data.price,
            realm_name: util.realm_name, 
            recommendgoods: res.data.data.recommendgoods,
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
   * 立即购买
   */
  buy: function (event){
    var id = event.currentTarget.dataset.id;
    var number = this.data.number;
    var stock = this.data.stock;
    var price = this.data.price;
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
    } else if (number > stock) {
      wx.showToast({
        title: '已售罄！',
        icon: 'none',
        duration: 2000
      })
      is_to = false;
    } else {
      var goodsbill = {};
      var total = 0;
      goodsbill[id] = number;
      total =number  * price;
    }

    if (is_to){
      wx.setStorage({
        key: "goodsbill",
        data: goodsbill
      });

      wx.setStorage({
        key: "total",
        data: total
      });

      wx.removeStorage({
        key: 'couponinfo',
      });

      wx.navigateTo({
        url: '/pages/cart/jiesuan?type=1'
      })
    }

  },
  /**
   * 加入购物车
   */
  addcart: function (event) {
    var id = event.currentTarget.dataset.id;
    var id = event.currentTarget.dataset.id;
    var tins = this;

    var cartsall = this.data.cartsall;
    var cartsarr = this.data.cartsarr;//购物车商品添加顺序
    var number   = this.data.number;
    var stock    = this.data.stock;
    var is_add   = true;

    if (number > stock) {
      wx.showToast({
        title: '已售罄！',
        icon: 'none',
        duration: 2000
      })
      is_add = false;
    }

    if (is_add){
      if (cartsall[id]) {
        cartsall[id] = cartsall[id] + number;
      } else {
        cartsall[id] = number;
      }

      if (cartsarr.indexOf(id) < 0) {
        cartsarr.unshift(id);
      }

      tins.setData({
        cartsall: cartsall,
        cartsarr: cartsarr
      })

      wx.setStorage({
        key: "cartsall",
        data: cartsall
      });

      wx.setStorage({
        key: "cartsarr",
        data: cartsarr
      });

      var arr = Object.keys(cartsall);
      var len = arr.length.toString();
      
      wx.setTabBarBadge({
        index: 3,
        text: len
      })

      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
    }
    
  }
})