// pages/goods/label_goods.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,//页码
    label_goodslist: [],
    cartsarr: [],
    cartsall: {},
    lodingtips: false,
    lodingtipstext: '加载中...',
    realm_name: util.realm_name,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var label_id = options.id;
    this.setData({
      label_id: label_id
    })
  },

  /**
   * 初始化页面数据
   */
  initdata: function () {
    var that = this;
    var label_id = this.data.label_id;
    //购物车对象
    wx.getStorage({
      key: 'cartsall',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok' && res.data) {
          
          that.setData({
            cartsall: res.data
          })
          var arr = Object.keys(res.data);
          var len = arr.length.toString();
          if (arr.length > 0) {
            wx.setTabBarBadge({
              index: 3,
              text: len
            })
          } else {
            wx.removeTabBarBadge({
              index: 3,
            })
          }
        }
      }
    })
    
    //购物车数组
    wx.getStorage({
      key: 'cartsarr',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok' && res.data) {
          that.setData({
            cartsarr: res.data
          })
        }
      }
    })
    that.goodslist(label_id, 1);
  },

  /**
   * 上拉触底
   */
  downpullloding: function () {
    

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
    wx.showLoading({
      title: '加载中',
    })
    this.initdata();
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
    var label_id = this.data.label_id;
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    this.goodslist(label_id, p);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 商品列表
   */

  goodslist: function (label_id, p) {
    var label_goodslist = this.data.label_goodslist.goodslist;
    var that = this;
    if (p > 1) {
      that.setData({
        lodingtipstext: '加载中...',
        lodingtips: true,
      })
    }
    // 商品
    wx.request({
      url: util.realm_name + 'api.php?c=Goods&a=label_goodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        p: p,
        label: label_id,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          var datas = res.data.data;
         
          var goodslist = datas;
          if (p > 1) {
            goodslist['goodslist'] = label_goodslist.concat(datas.goodslist);
          } else {
            goodslist['goodslist'] = datas.goodslist;
          }
          
          that.setData({
            label_goodslist: goodslist,
            p: p
          })

          if (datas.goodslist.length < 1) {
            that.setData({
              lodingtipstext: res.data.msg,
              lodingtips: true,
            })
          } else {
            that.setData({
              lodingtips: false,
            })
          }
        } else if (res.data.code == 203) {
          that.setData({
            lodingtipstext: res.data.msg,
            lodingtips: true,
          })
        }
        
      }
    })
  },

  /**
   * 购买数量加减
   */
  addcart: function (event) {
    var clicktype = event.currentTarget.dataset.type;
    var id = event.currentTarget.dataset.id;
    var tins = this;
    var cartsall = this.data.cartsall;
    var cartsarr = this.data.cartsarr;//购物车商品添加顺序

    if (clicktype == "plus") {
      if (cartsall[id] != undefined) {
        cartsall[id]++;
      } else {
        cartsall[id] = 1
        cartsarr.unshift(id);
      }

    } else if (clicktype == "min") {
      if (cartsall[id] != undefined && cartsall[id] >= 0) {
        cartsall[id]--;
        if (cartsall[id] == 0) {
          var index = cartsarr.indexOf(id);
          if (index > -1) {
            cartsarr.splice(index, 1);
          }
          delete cartsall[id];
        }
      }
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
    if (arr.length > 0) {
      wx.setTabBarBadge({
        index: 3,
        text: len
      })
    } else {
      wx.removeTabBarBadge({
        index: 3,
      })
    }
  },

  /**
   * 库存不足提示
   */
  nostock: function () {
    wx.showToast({
      title: '库存不足！',
      icon: 'none',
      duration: 2000
    })
  }
})