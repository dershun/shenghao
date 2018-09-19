// pages/member/set_up.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_login: false,
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
    var tins = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          tins.setData({
            userinfo: res.data,
            is_login: true,
          })

          //获取会员信息
          wx.request({
            url: util.realm_name + 'api.php?c=Member&a=getuserinfo',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
              uid: res.data.id
            },
            success: function (ress) {
              wx.hideLoading();
              if (ress.statusCode == 200) {
                var data = ress.data;
                if (data.code == 200) {
                  tins.setData({
                    userinfo: data.data,
                  })
                  wx.setStorage({
                    key: 'userinfo',
                    data: data.data,
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
        }
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
   * 打开新页面
   */
  open_page: function (e) {
    var url = e.currentTarget.dataset.url;
    var login = e.currentTarget.dataset.login;

    if (login) {
      var is_login = this.data.is_login;
      if (is_login) {
        wx.navigateTo({
          url: url
        })
      } else {
        wx.showToast({
          title: '登陆获取更多权限',
          icon: 'none',
          duration: 2000
        })
      }

    } else {
      wx.navigateTo({
        url: url
      })
    }
  },
  /**
   * 退出登陆
   */
  out_loging:function(){
    wx.removeStorage({
      key: 'userinfo',
      success: function (res) {
        wx.navigateBack({
          delta: -1
        });
      }
    })
  }
})