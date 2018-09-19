// pages/cart/choiceaddress.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
     addresslist:[],
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
            if (res.data.code == 200) {
              that.setData({
                addresslist: res.data.data,
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

  },
  /**
   * 选择地址
   */
  pickeraddress: function (e) {
    var value = e.detail.value;
    var userinfo = this.data.userinfo;
    userinfo['default_address'] = value;
    //会员信息
    wx.setStorage({
      key: 'userinfo',
      data: userinfo,
    });
    wx.navigateBack({
      delta: -1
    });
  },

  /**
   * 确认地址
   */
  Submitaddress: function (e) {
    
  }
})