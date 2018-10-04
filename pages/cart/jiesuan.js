// pages/cart/jiesuan.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isix: app.globalData.isix,
    dispatching: '',//配送方式
    pay_mode: '',//支付方式
    address:'',//配送地址
    goodslist: [],//商品列表
    goodsbill: [],//清单id数组
    goodssum: 0,//商品总数
    total:'0.00',//总金额
    asset:'0.00',//余额
    postage:'0.00',//运费
    userinfo:{},//会员信息
    price_spec:0,
    is_address: false,
    special_price:0,//不参与免运费用
    store: [],
    storearr: [],
    storeaddress:'点击选择门店',//门店地址
    is_add_postage: false //是否加运费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;

    if (options.type) {
      that.setData({
        order_type: options.type,
      })
    }

    //会员信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          userinfo: res.data,
        })
      }
    })

    //总价格
    wx.getStorage({
      key: 'total',
      success: function (res) {
        that.setData({
          total: res.data,
          total_q: res.data,
        })
      }
    })

    //众筹价格档位
    wx.getStorage({
      key: 'price_spec',
      success: function (res) {
        that.setData({
          price_spec: res.data,
        })
      }
    })
    
    //购物车排序数组
    wx.getStorage({
      key: 'cartsarr',
      success: function (res) {
        that.setData({
          cartsarr: res.data,
        })
      }
    })

    //购物车对象
    wx.getStorage({
      key: 'cartsall',
      success: function (res) {
        that.setData({
          cartsall: res.data,
        })
      }
    })

    //购物车数组
    wx.getStorage({
      key: 'goodsbill',
      success: function (res) {

        var idall = res.data;
        
        var idalls = JSON.stringify(idall);
       
        // 购物清单
        wx.request({
          url: util.realm_name +'api.php?c=Cart&a=goodsbill',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            member_id: that.data.userinfo.id,
            cartsall: idalls,
            order_type: options.type,
            total: that.data.total
          },
          success: function (res) {
            if (res.data.code == 200) {
              var goodsdata = res.data.data.goodslist;
              var goodssum  = goodsdata.length;
              that.setData({
                goodsbill:idall,
                goodslist: goodsdata,
                goodssum: goodssum,
                postage_p: res.data.data.postage,
                coupon: res.data.data.member_coupon.coupon,
              })
       
              if (res.data.data.member_coupon.code == 200){
                that.setData({
                  coupon_sto: true,
                  coupon_nu: res.data.data.member_coupon.msg,
                  
                })
              } else {
                that.setData({
                  coupon_sto: false,
                  coupon_nu: res.data.data.member_coupon.msg,
                })
              }
            }
          }
        })

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var tar = this;
    //会员信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          tar.setData({
            userinfo: res.data,
          })
          // 账户余额
          wx.request({
            url: util.realm_name + 'api.php?c=Member&a=getasset',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
              uid: res.data.id,
            },
            success: function (res) {
              if (res.data.code == 200) {
                tar.setData({
                  asset: res.data.data,
                })
              }
            }
          })
          //优惠卷信息
          wx.getStorage({
            key: 'couponinfo',
            success: function (res) {
              if (res.errMsg == 'getStorage:ok') {
                var total = tar.data.total_q;
                var dispatching = tar.data.dispatching;
                var postage = res.data.postage;
                
                if (res.data.id > 0){
                  if (res.data.coupon_type == 1) {
                    var totals = ((total * 1) - (res.data.price * 1))
                    totals = totals.toFixed(2);
                    postage = "0.00";
                    if (dispatching == 1) {
                      var totals = ((total * 1) - (res.data.price * 1)) + (res.data.postage * 1);
                      totals = totals.toFixed(2);
                      postage = res.data.postage;
                    }
                    tar.setData({
                      couponinfo: res.data,
                      total: totals,
                      postage: postage,
                      coupon_nu: "-￥" + res.data.price,
                    })
                  } else if (res.data.coupon_type == 3) {
                    var totals = (total * 1);
                    totals = totals.toFixed(2);
                    postage = "0.00";
                    if (dispatching == 1) {
                      var totals = (total * 1) + (res.data.postage * 1);
                      totals = totals.toFixed(2);
                      postage = res.data.postage;
                    }
                    tar.setData({
                      couponinfo: res.data,
                      postage: postage,
                      total: totals,
                      coupon_nu: "-￥" + res.data.price,
                    })
                  }
                }else{
                  var postages = "0.00";
                  var totals = (total * 1);
                  if (dispatching == 1) {
                    var postages = postage;
                    totals = (total * 1) + (postage * 1);
                  }
                  totals = totals.toFixed(2);
                  tar.setData({
                    couponinfo: res.data,
                    total: totals,
                    postage: postages,
                    coupon_nu: "-￥0.00" ,
                  })
                }
                
              }
            }
          })
          if (res.data.default_address) {
            tar.getaddress(res.data.default_address, res.data.id);
          }
        }
      }
    })

    

  },

  /**
   * 获取地址 
   */
  getaddress:function(id,uid){
    var tar = this;
    // 获取地址
    wx.request({
      url: util.realm_name + 'api.php?c=Address&a=getaddress',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        uid: uid,
        id: id,
      },
      success: function (res) {
        if (res.data.code == 200) {
          
          tar.setData({
            address: res.data.data,
            address_id: id,
            is_address: true,
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
   * 配送方式
   */
  dispatching: function(osg) {
    var that = this;
    var is_add_postage = that.data.is_add_postage;
    if (that.data.couponinfo){
      var postage_p = that.data.couponinfo.postage;
    }else{
      var postage_p = that.data.postage_p;
    }
    if (osg.detail.value == 1){
      if (!is_add_postage){
        var total = (that.data.total * 1) + (postage_p * 1);
        total = total.toFixed(2);
        that.setData({
          total: total,
          postage: postage_p,
          is_add_postage: true
        })
      }
      
    }else if (osg.detail.value == 2){
      if (is_add_postage) {
        var total = (that.data.total * 1) - (that.data.postage * 1);
        total = total.toFixed(2);
        that.setData({
          total: total,
          postage: '0.00',
          is_add_postage: false
        })
      }
      // 门店列表
      wx.request({
        url: util.realm_name +'api.php?c=Cart&a=getstore',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              store: res.data.data.store,
              storearr: res.data.data.storearr,
            })
          }
        }
      })
    }
    this.setData({
      dispatching: osg.detail.value,
    })
  },
  /**
   * 配送地址
   */
  address: function (osg) {
    this.setData({
      address: osg.detail.value,
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
   * 添加收货地址
   */

  addaddress: function (osg){
    wx.navigateTo({
      url: '/pages/address/addaddress?one=true'
    })
  },

  /**
   * 切换地址
   */
  choiceaddress:function(){
    wx.navigateTo({
      url: '/pages/cart/choiceaddress'
    })
  },
  
  /**
   * 选择门店
   */
  storeaddress: function (e){
    var storearr = this.data.storearr;
    var value = e.detail.value
    var all = storearr[value];
    this.setData({
      index: value,
      store_id: all.id,
      store_name: all.name,
      storeaddress: all.address,
    })
  },

  /**
   * 下单
   */
  add_order: function (osg){
    var dispatching = this.data.dispatching;//配送方式
    var pay_mode = this.data.pay_mode;//支付方式
    var asset = this.data.asset;//账户余额
    var total = this.data.total;//总金额
    var address_id = this.data.address_id;//收货地址id
    var store_id = this.data.store_id;//门店id
    var userinfo = this.data.userinfo;//会员信息
    var couponinfo = this.data.couponinfo;//优惠卷信息
    var submit = true;
    var tal = this;
    
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
      submit = false;
    } else if (!dispatching) {
      wx.showToast({
        title: '请选择配送方式',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (dispatching == 1 && !address_id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (dispatching == 2 && !store_id) {
      wx.showToast({
        title: '请选择门店',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (!pay_mode) {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (pay_mode == 1 && (asset * 1) < (total * 1)){
      wx.showModal({
        title: '余额不足',
        content: '立即前往个人中心充值',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/member/index'
            })
          }
        }
      })
      submit = false;
    }

    if (submit) {
      var goodsbill = this.data.goodsbill;//商品清单id和数量
      
      var freight = this.data.postage;//运费
      var order_type = this.data.order_type//订单类型
      var price_spec = this.data.price_spec//众筹档位
      
      var goodsbills = JSON.stringify(goodsbill);

      var podata = {
        uid: this.data.userinfo.id,
        order_price: total,
        goodsid: goodsbills,
        deliver_type: dispatching,
        address_id: address_id,
        pay_type: pay_mode,
        order_type: order_type,
        price_spec: price_spec,
        store_id: store_id,
        freight: freight,
        
      };

      if (couponinfo){
        podata['coupon_id']= couponinfo.id;
      }
     
      wx.request({
        url: util.realm_name +'api.php?c=Order&a=addorder',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: podata,
        success: function (res) {

          if (res.data.code == 200) {
            var datas = res.data.data;
            datas.openid = userinfo.openid;
            if (order_type == 1){
              tal.selcart();//调用清理购物车
            } else if (order_type == 2){
              wx.removeStorage({
                key: 'price_spec',
              })
            }
              tal.pay(datas);//调用支付
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none',
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
  pay:function(data){
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var pay_mode = this.data.pay_mode;//支付方式
    
    if (pay_mode == 2)//微信支付
    {
      wx.request({
        url: util.realm_name +'api.php?c=Wechatpay&a=public_jsapipay',
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
        url: util.realm_name +'api.php?c=Wechatpay&a=public_yuerpay',
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
            } else if(datass.code == 100) {
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

  /**
   * 清理购物车
   */
  selcart:function(){
    var goodsbill = this.data.goodsbill;//商品清单id和数量
    var cartsarr  = this.data.cartsarr;//购物车数组
    var cartsall  = this.data.cartsall;//购物车对象

    if (cartsarr){
      for (var key in goodsbill) {
        var index = cartsarr.indexOf(key);
        if (index > -1) {
          cartsarr.splice(index, 1);
        }
        delete cartsall[key];
      }
    }
    
   
    wx.setStorage({
      key: "cartsarr",
      data: cartsarr
    });

    wx.setStorage({
      key: "cartsall",
      data: cartsall
    });

    //总价格
    wx.setStorage({
      key: 'total',
      data: '0.00'
    })

  },

  /**
   * 选择优惠卷
   */
  choice_coupon:function(){
    var postage_p = this.data.postage_p;
    var coupon = this.data.coupon;

    wx.navigateTo({
      url: '/pages/cart/coupon_list?postage=' + postage_p + "&coupon=" + coupon
    })
  }
})