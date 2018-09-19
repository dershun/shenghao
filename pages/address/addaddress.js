// pages/member/addaddress.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isix: app.globalData.isix,
    userinfo: {},//会员信息
    addressinfo: {},//会员信息
    community: [],
    communityarr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (JSON.stringify(options) != "{}" && options.one) {
      that.setData({
        one: options.one,
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
    });

    // 小区列表
    wx.request({
      url: util.realm_name +'api.php?c=Address&a=getcommunity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          var communityarr = res.data.data.communityarr;
          that.setData({
            community: res.data.data.community,
            communityarr: communityarr,
          })

          //获取地址详情
          if (JSON.stringify(options) != "{}" && options.id && options.uid) {
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: util.realm_name + 'api.php?c=Address&a=getaddress',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                id: options.id,
                uid: options.uid,
              },
              success: function (ress) {
             
                wx.hideLoading();
                if (ress.data.code == 200) {
                  var index = that.data.index;
                  for (var key in communityarr) {
                    if (communityarr[key].id == ress.data.data.community_id) {
                      index = key;
                    }
                  }
                  that.setData({
                    addressinfo: ress.data.data,
                    index: index,
                    community_id: ress.data.data.community_id,
                    address_id: options.id,
                  })
                }
              }
            })
          }
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
   * 选择小区
   */
  pickercommunity:function(e){
    var communityarr = this.data.communityarr;
    var value = e.detail.value
    var all = communityarr[value];

    this.setData({
      index: value,
      community_id: all.id,
    })
  },

  /**
   * 保存地址
   */
  formSubmit: function (e){
    var that = this;
    var data = e.detail.value;
    var userinfo = that.data.userinfo;
    var community_id = that.data.community_id;
    var Submit = true;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    
    if (!data.name){
      wx.showToast({
        title: '请输入收件人姓名',
        icon: 'none',
        duration: 2000
      })
      Submit=false;
    }
    if (!data.tel) {
      wx.showToast({
        title: '请输入收件人手机号',
        icon: 'none',
        duration: 2000
      })
      Submit = false;
    }
    
    if (!myreg.test(data.tel)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      Submit = false;
    }
    if (!data.community_id) {
      wx.showToast({
        title: '请选择小区',
        icon: 'none',
        duration: 2000
      })
      Submit = false;
    }
    if (!data.address) {
      wx.showToast({
        title: '请输入收件人详细地址',
        icon: 'none',
        duration: 2000
      })
      Submit = false;
    }

    if (Submit){
      data['uid'] = userinfo.id;
      data['community_id'] = community_id;
      var address_id = that.data.address_id;
      if (address_id){
        data['id'] = address_id;
      }
      // 提交
      wx.request({
        url: util.realm_name +'api.php?c=Address&a=addAddress',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data:data,
        success: function (res) {
          if (res.data.code == 200) {
            if (that.data.one) {
              userinfo['default_address'] = res.data.data;
              wx.setStorage({
                key: 'userinfo',
                data: userinfo,
              })
            }
            wx.navigateBack({
              delta: -1
            });
          } else if (res.data.code == 100){
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
   * 设为默认地址
   */
  morenaddress:function(e){
    var addressinfo = this.data.addressinfo;
    var userinfo = this.data.userinfo;
    var value = e.detail.value;

    // 更改默认地址
    wx.request({
      url: util.realm_name + 'api.php?c=Address&a=edit_default_address',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        addressid: addressinfo.id,
        uid: userinfo.id,
      },
      success: function (res) {
        if (res.statusCode == 200){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          if (res.data.code == 200) {
            userinfo['default_address'] = res.data.data;
            wx.setStorage({
              key: 'userinfo',
              data: userinfo,
            })
          }
        }else{
          wx.showToast({
            title: '设置异常',
            icon: 'none',
            duration: 2000
          })
        }
        
      }
    })
  }
})