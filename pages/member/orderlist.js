// pages/member/orderlist.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'all',
    typelist:[
      { id: 1, name: "全部", type: "all" },
      { id: 2, name: "待付款", type: "dpay" },
      { id: 3, name: "待发货", type: "dfh" },
      { id: 4, name: "待收货", type: "dsh" },
      { id: 5, name: "售后", type: "as" },
    ],
    orderlist:[],
    realm_name:'',
    is_order:true,
    immediately_pay:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (JSON.stringify(options) != "{}"){
      this.setData({
        type: options.state,
        uid: options.uid,
        realm_name: util.realm_name,
      })
    }
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
    this.orderlist();
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
   * 订单类型
   */
  ordertype:function(e){
    var type = e.currentTarget.dataset.type;
    this.setData({
      type: type
    })
    this.orderlist();
  },
  /**
   * 订单列表
   */
  orderlist:function(){
    wx.showLoading({
      title: '请稍后',
      mask: true
    })

    var that = this;
    var type = this.data.type;
    var uid  = this.data.uid;
    // 订单列表
    wx.request({
      url: util.realm_name + 'api.php?c=Order&a=myorderlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        type: type,
        uid: uid,
        order_type: 1,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            orderlist: res.data.data,
            is_order:true,
          })
        }else{
          that.setData({
            orderlist: "",
            is_order: false,
          })
        }
      }
    })
  },
  /**
   * 取消订单
   */
  cancel_order:function(e){
    var id  = e.currentTarget.dataset.id;
    var uid = this.data.uid;
    wx.showModal({
      title: '提示',
      content: '确定申请取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/member/cancel_order?id=' + id + "&uid=" + uid
          })
        }
      }
    })
  },
  /**
   * 申请售后
   */
  after_sale: function (e) {
    var id = e.currentTarget.dataset.id;
    var uid = this.data.uid;
    wx.navigateTo({
      url: '/pages/member/after_sale?id=' + id + "&uid=" + uid
    })
  },

  /**
   * 选择支付方式
   */
  choice_pay: function (e) {
    var that =this;
    var uid = that.data.uid;
    var orderno = e.currentTarget.dataset.orderno;
    // 账户余额
    wx.request({
      url: util.realm_name + 'api.php?c=Member&a=getasset',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        uid: uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            asset: res.data.data,
          })
        }
      }
    })
    var immediately_pay = this.data.immediately_pay;
    this.setData({
      immediately_pay: (!immediately_pay),
      orderno: orderno,
    })
  },

  /**
   * 支付方式
   */
  pay_mode: function (osg) {
    this.setData({
      pay_mode: osg.detail.value,
    })
  },

  /**
   * 取消选择
   */

  out_pay:function(){
    var immediately_pay = this.data.immediately_pay;
    this.setData({
      immediately_pay: (!immediately_pay)
    })
  },

  /**
   * 支付
   */
  immediately_pay: function (data) {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var pay_mode = this.data.pay_mode;//支付方式
    var orderno = this.data.orderno;//订单号
    var userinfo = this.data.userinfo;//会员信息
    
    var data = {
      openid: userinfo.openid,
      table: 'order',
      orderno: orderno,
      goodsname: "普通商品订单",
      notify_url: util.realm_name + 'api.php/Wechatpay/editorder',
    }

    if (pay_mode == 2)//微信支付
    {
      wx.request({
        url: util.realm_name + 'api.php?c=Wechatpay&a=public_jsapipay',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: data,
        success: function (osg) {
          wx.hideLoading()
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
                  wx.redirectTo({
                    url: '/pages/prompt/buyok'
                  })
                },
                'fail': function (s) {
                  wx.redirectTo({
                    url: '/pages/prompt/payerror'
                  })
                }
              })
            }
          }
        }
      })
    }
    else if (pay_mode == 1)//余额支付
    {

      wx.request({
        url: util.realm_name + 'api.php?c=Wechatpay&a=public_yuerpay',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: data,
        success: function (osg) {
          wx.hideLoading()
          if (osg.statusCode == 200) {
            var datass = osg.data;
            if (datass.code == 200) {
              wx.redirectTo({
                url: '/pages/prompt/buyok'
              })
            } else if (datass.code == 203) {
              wx.showModal({
                title: datass.msg,
                content: '立即前往个人中心充值',
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/member/index'
                    })
                  } else if (res.cancel) {
                    wx.redirectTo({
                      url: '/pages/prompt/payerror'
                    })
                  }
                }
              })
            } else if (datass.code == 100) {
              wx.showToast({
                title: datass.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
      })
    }
  },

  
})