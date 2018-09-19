// pages/member/cancel_order.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
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
   * 提交申请
   */
  formSubmit:function(e){
    var options = this.data.options;
    options.reason = e.detail.value.reason;

    var submit = true;
    if (!options.reason){
      wx.showToast({
        title: '请输入取消理由',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    }

    if (submit){
      wx.showLoading({
        title: '请稍后',
        mask: true
      })

      wx.request({
        url: util.realm_name + 'api.php?c=Order&a=cancel_order',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: options,
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode == 200){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            if (res.data.code == 200) {
              wx.navigateBack({
                delta: -1
              });
            } 
          }else{
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
})