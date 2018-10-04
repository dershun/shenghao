// pages/cart/index.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [],//商品列表
    priceall: {},//价格对象
    cartsall: {},//购物车对象
    checkarr: {},//选取对象
    stockall: {},//库存对象
    checkall: false,//是否全选
    total: '0.00',//总金额
    sum:0,//总件数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.initdata();
  },

  /**
   * 初始化数据
   */
  initdata:function(){

    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    
    that.setData({
      check: false,
      checkall: false,//是否全选
      total: '0.00',//总金额
      sum: 0,//总件数
    })

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
        if (res.errMsg == 'getStorage:ok' && res.data) {
          that.setData({
            cartsall: res.data,
          })
        }
      }
    })

    //购物车数组
    wx.getStorage({
      key: 'cartsarr',
      success: function (res) {
        var idall = res.data;
        that.setData({
          cartsarr: idall,
        })
        that.goodslist(idall);
      }
    })
    wx.hideLoading();
  },

  /**
   * 商品列表
   */
  goodslist: function (idall){
    var that = this;
    var idalls = JSON.stringify(idall);
    // 购物车商品
    wx.request({
      url: util.realm_name + 'api.php?c=Cart&a=goodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        cartsall: idalls,
      },
      success: function (res) {

        if (res.data.code == 200) {
          var cartsall = that.data.cartsall;
          var cartsalls = {};
          var checkarr = {};
          var goodsdata = res.data.data;
          var priceall = that.data.priceall;
          for (var i = 0; i < goodsdata.length; i++) {
            if (cartsall[goodsdata[i].id]) {
              cartsalls[goodsdata[i].id] = cartsall[goodsdata[i].id];
            }
            priceall[goodsdata[i].id] = goodsdata[i].price;
            checkarr[goodsdata[i].id] = false;
          }
          that.setData({
            goodslist: goodsdata,
            priceall: priceall,
            cartsall: cartsalls,
            checkarr: checkarr,
          })
          var len = goodsdata.length.toString();
          if (goodsdata.length > 0) {
            wx.setTabBarBadge({
              index: 3,
              text: len
            })
          } else {
            wx.removeTabBarBadge({
              index: 3,
            })
          }
          wx.setStorage({
            key: 'cartsall',
            data: cartsalls
          })
        }
      }
    })
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
   * 购买数量加减
   */
  addcart: function (event) {
    var clicktype = event.currentTarget.dataset.type;
    var id = event.currentTarget.dataset.id;
    
    var tins = this;
    var cartsall = this.data.cartsall;//购物车对象
    var priceall = this.data.priceall;//价格对象
    var checkarr = this.data.checkarr;//选取对象
    var sum = this.data.sum;//总件数
    var total = this.data.total;//总价格
    var is_check = false;

    for (var key in checkarr) {
      if (checkarr[key]){
        is_check = true;
      }
    }

    if (clicktype == "plus") {
      if (cartsall[id] != undefined) {
        if (is_check){
          sum++;
          total = (total * 1) + (priceall[id] * 1);
          total = total.toFixed(2);
        }
        cartsall[id]++;
      } else {
        cartsall[id] = 1
      }
    } else if (clicktype == "min") {
      if (cartsall[id] != undefined && cartsall[id] > 1) {
        if (is_check) {
          sum--;
          total = (total * 1) - (priceall[id] * 1);
          total = total.toFixed(2);
        }
        cartsall[id]--;
      }
    }

    
    tins.setData({
      cartsall: cartsall,
      sum: sum,
      total: total
    })

    wx.setStorage({
      key: "cartsall",
      data: cartsall
    });

    var arr = Object.keys(cartsall);
    var len = arr.length.toString();

    wx.setTabBarBadge({
      index: 3,
      text: len,
      
    })

  },

  /**
   * 全选商品
   */
  checkall:function(osg){
    var checkall = !this.data.checkall;//全选按钮
    var cartsall = this.data.cartsall;//购物车对象
    var check = checkall;//列表全选
    var checkarr = this.data.checkarr;//选取对象
    var priceall = this.data.priceall;//价格对象
    var sum = 0;//总件数
    var total = "0.00";//总价格

    if (JSON.stringify(cartsall) != "{}" ){
      if (checkall) {
        for (var key in cartsall) {
          checkarr[key] = true;
          sum += cartsall[key];
          total = (total * 1) + (priceall[key] * 1 * cartsall[key]);
        }
        total = total.toFixed(2);
      } else {
        for (var key in cartsall) {
          checkarr[key] = false;
        }
      }

      this.setData({
        checkall: checkall,
        check: check,
        checkarr: checkarr,
        sum: sum,
        total: total,
      })
    }

  },

  /**
   * 选择商品
   */
  check_box: function (osg) {
    var id = osg.currentTarget.dataset.id;//当前id
    var checkall = this.data.checkall;//全选按钮
    var checkarr = this.data.checkarr;//选取对象
    var cartsall = this.data.cartsall;//购物车对象
    var priceall = this.data.priceall;//价格对象
    var sum = this.data.sum;//总件数
    var total = this.data.total;//总价格

    if (checkarr[id]) {
      checkarr[id] = false;
      for (var key in cartsall) {
        if (key == id) {
          sum -= cartsall[key];
          total = (total * 1) - (priceall[key] * 1 * cartsall[key]);
        }
      }
      
    } else {
      checkarr[id] = true;
      for (var key in cartsall) {
        if (key == id) {
          sum += cartsall[key];
          total = (total * 1) + (priceall[key] * 1 * cartsall[key]);
        }
      }
      
    }
    total = total.toFixed(2);
    var check = true;
    if (JSON.stringify(checkarr) != "{}"){
      for (var key in checkarr) {
        if (!checkarr[key]) {
          var check = false
        }
      }
    }else{
      var check = false
    }

    this.setData({
      checkall: check,
      sum: sum,
      total: total,
    })

  },

  /**
   * 删除购物车
   */
  del_cart: function (osg){
    var id = osg.currentTarget.dataset.id;//当前id
    var cartsarr = this.data.cartsarr;//购物车数组
    var cartsall = this.data.cartsall;//购物车对象
    var priceall = this.data.priceall;//价格对象
    var sum = this.data.sum;//总件数
    var total = this.data.total;//总价格
    var that = this;
    wx.showModal({
      title: '确定移除该商品？',
      success: function (res) {
        if (res.confirm) {
          var index = cartsarr.indexOf(id);
          if (index > -1) {
            cartsarr.splice(index, 1);//移除指定商品
          }
          
          //购物车数组
          wx.setStorage({
            key: 'cartsarr',
            data: cartsarr
          })
          that.goodslist(cartsarr);
          for (var key in cartsall) {
            if (key == id) {
              sum -= cartsall[key];
              total = (total * 1) - (priceall[key] * 1 * cartsall[key]);
            }
          }
          total = total.toFixed(2);
          
          that.setData({
            cartsarr: cartsarr,
            sum: sum,
            total: total,
            check: false,
            checkall: false,//是否全选
            total: '0.00',//总金额
            sum: 0,//总件数
          })
        }
      }
    })
  },
  /**
   * 结算
   */
  place_an_order:function(osg){
    var checkarr = this.data.checkarr;//选取对象
    var cartsall = this.data.cartsall;//购物车对象
    var stockall = this.data.stockall;//库存对象
    var total = this.data.total;//总价格
    var sum = this.data.sum;//总件数
    var userinfo = this.data.userinfo;//会员信息
    var submit = true;

    if (!userinfo){
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
      submit = false;
    } else if (sum == 0){
      wx.showToast({
        title: '您还没有选择商品哦',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    }
    
    if (submit){
      var goodsbill = {} ;
      for (var key in cartsall) {
        if (checkarr[key]) {
          if (cartsall[key] > stockall[key]){
            goodsbill[key] = stockall[key];
          }else{
            goodsbill[key] = cartsall[key];
          }
        }
      }

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
      })
      
      wx.navigateTo({
        url: '/pages/cart/jiesuan?type=1'
      })
    }
    
  }
})