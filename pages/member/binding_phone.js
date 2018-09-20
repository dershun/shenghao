// pages/member/binding_phone.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 60,
    codetext: "获取验证码",
    is_send: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tins = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok') {
          tins.setData({
            userinfo: res.data,
          })
        }
      }
    });
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
   * 输入手机号
   */
  inputtel: function (e) {
    var value = e.detail.value;
    this.setData({
      tel: value,
    })
  },

  /**
   * 获取验证码
   */
  getcode: function () {
    var that = this;
    var tel = this.data.tel;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var submit = true;

    if (!tel) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (!myreg.test(tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    }

    if (submit) {
      // 订单列表
      wx.request({
        url: util.realm_name + 'api.php?c=Member&a=send_code',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          tel: tel,
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              code: res.data.data,
            })
            wx.showToast({
              title: '验证码已发送，请注意查收',
              icon: 'none',
              duration: 2000
            })
            that.startTap();
          } else {
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
     * 开始倒计时
    */
  startTap: function () {
    var that = this;
    var time = that.data.time;
    that.setData({
      is_send: true,
      codetext: '已发送' + time + 's',
    })
    var interval = setInterval(function () {
      time--;
      that.setData({
        time: time,
        codetext: '已发送' + time + 's',
      })

      if (time == 0) {           //归0时回到60
        clearInterval(that.data.interval);
        that.setData({
          is_send: false,
          time: 60,
          interval: '',
          codetext: '重新获取',
        })
      }
    }, 1000)

    that.setData({
      interval: interval
    })
  },

  /**
   * 提交
   */
  formSubmit: function (e) {
    var value = e.detail.value;
    var code = this.data.code;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var submit = true;
    if (!value.tel) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (!myreg.test(value.tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (!value.code) {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    } else if (value.code != code) {
      wx.showToast({
        title: '短信验证码错误',
        icon: 'none',
        duration: 2000
      })
      submit = false;
    }

    var userinfo = this.data.userinfo;

    if (submit) {
      // 提交绑定
      wx.request({
        url: util.realm_name + 'api.php?c=Member&a=pay_password',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          id: userinfo.id,
          tel: value.tel,
          pay_password: value.pay_password,
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            userinfo['tel'] = res.data.data;
            //会员信息
            wx.setStorage({
              key: 'userinfo',
              data: userinfo,
            });

            wx.navigateBack({
              delta: -1
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })

    }
  }
})