// pages/address/addresslist.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isix: app.globalData.isix,
    addresslist:{}
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
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    //会员信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          userinfo: res.data,
        })
        
        // 地址列表
        wx.request({
          url: util.realm_name + 'api.php?c=Address&a=addresslist',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            uid: res.data.id
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
              that.setData({
                addresslist: res.data.data,
              })
            }
          }
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
                that.setData({
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

  }


})