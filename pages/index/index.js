// pages/goods/index.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    goodslist: [],
    home_label: [],
    home_classify: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    indicator_color:'#009999',
    p: 1,
    realm_name: util.realm_name,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    var that = this;

    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          that.setData({
            userinfo: res.data,
          })
        }
      }
    });

    //banner
    wx.request({
      url: util.realm_name +'api.php?c=Index&a=bannerlist',
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

    //分类
    wx.request({
      url: util.realm_name +'api.php?c=Index&a=home_classify',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            home_classify: res.data.data,
          })
        }
      }
    })

    //商品标签及对应商品列表
    wx.request({
      url: util.realm_name +'api.php?c=Index&a=home_label_goods',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            home_label_goods: res.data.data,
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
    //购物车数组
    wx.getStorage({
      key: 'cartsall',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok' && res.data) {
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
   * 页面跳转
   */
  gourl: function (event){
    var type = event.currentTarget.dataset.type;
    var url = event.currentTarget.dataset.url;
    if (type = 'switchTab'){
      wx.switchTab({
        url: url
      })
    } else if (type = 'navigateTo') {
      wx.navigateTo({
        url: url
      })
    }
    
  },

  /** 
   * 商品分类
   */
  goodsclassify: function (event) {
    var id = event.currentTarget.dataset.id;
    var pid = event.currentTarget.dataset.pid;
    var data = { id: id, pid: pid};

    wx.setStorageSync('home_classify', data)

    wx.switchTab({
      url: '/pages/goods/index'
    })
  },

  /**
   * 修改充值金额
   */
  exitrecharge: function (e){
    this.setData({
      recharge: e.detail.value
    })
    return e.detail.value;
  },

  /**
   * 下单
   */
  add_order: function (osg) {
    var recharge = this.data.recharge;//总金额
    var userinfo = this.data.userinfo;
    var submit = true;
    var tal = this;
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg.test(recharge) || recharge <= 1) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    }

    if (submit) {
      wx.request({
        url: util.realm_name +'api.php?c=Order&a=chongzhiorder',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          uid: userinfo.id,
          order_price: recharge,
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
        url: util.realm_name +'api.php?c=Wechatpay&a=public_jsapipay',
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