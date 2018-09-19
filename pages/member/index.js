// pages/member/index.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    is_login:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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

    wx.request({
      url: util.realm_name + 'api.php?c=Systematic&a=getsystematic',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {

        if (res.data.code == 200) {
          that.setData({
            systematic: res.data.data,
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
    var tins = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          tins.setData({
            userinfo: res.data,
            is_login: true,
          })
          tins.getmemberasset(res.data.id);
        }
      },
      fail: function (res){
        tins.setData({
          userinfo: {},
          is_login: false,
        })
      }
    });
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
   * 获取微信信息
   */
  getwechatinfo: function (e){
    var tins = this;
    var userinfo = e.detail.userInfo;
    if (!userinfo){
      return false;
    }
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          var postdata = userinfo;
              postdata['code'] = res.code;
          //发起网络请求
          wx.request({
            url: util.realm_name +'api.php?c=Member&a=getsessionopenid',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: postdata,
            success: function (res) {
              wx.hideLoading()
              if (res.statusCode == 200) {
                var data = res.data;
                if (data.code == 200) {
                  tins.setData({
                    userinfo: data.data,
                    is_login: true,
                  })
                  wx.setStorage({
                    key: 'userinfo',
                    data: data.data
                  });
                  tins.getmemberasset(data.data.id);
                  if (data.data.state>0){
                    
                  }else{
                    wx.showModal({
                      title: '安全提示',
                      content: '绑定手机，账号更安全',
                      success: function (res) {

                        if (res.confirm) {
                          wx.navigateTo({
                            url: '/pages/member/paypasswd'
                          })
                        }
                      }
                    })
                  }
                }else{
                  wx.showToast({
                    title: '登录失败!',
                    icon: 'none',
                    duration: 2000
                  })
                }
              } else {
                wx.showToast({
                  title: '网络错误',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  /**
   * 获取余额
   */
  getmemberasset:function(id){
    var tins = this;
    // 账户余额
    wx.request({
      url: util.realm_name + 'api.php?c=Member&a=getasset',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        uid: id,
      },
      success: function (res) {
        if (res.data.code == 200) {
          tins.setData({
            asset: res.data.data,
          })
        }
      }
    })
  },

  /**
   * 打开新页面
   */
  open_page:function(e){
    var url = e.currentTarget.dataset.url;
    var login = e.currentTarget.dataset.login;

    if (login){
      var is_login = this.data.is_login;
      if (is_login){
        wx.navigateTo({
          url: url
        })
      }else{
        wx.showToast({
          title: '登陆获取更多权限',
          icon: 'none',
          duration: 2000
        })
      }
      
    }else{
      wx.navigateTo({
        url: url
      })
    }
  },

  /**
   * 拨打客户电话
   */
  phonecall: function (event) {
    var tel = event.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})