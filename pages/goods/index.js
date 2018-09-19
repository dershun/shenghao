// pages/goods/index.js
const app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify_id:'',//选中分类id
    classifyf_id: '',//父id
    classifys_id: '',//子id
    p: 1,//页码
    classifylist: [],
    classifysubsetlist: [],
    goodslist: [],
    cartsarr : [],
    cartsall:{},
    lodingtips:false,
    lodingtipstext:'加载中...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 初始化页面数据
   */
  initdata:function(){
    var that = this;

    //首页传参
    var home_classify = wx.getStorageSync('home_classify');
    if (home_classify){
      if (home_classify.pid == '0') {
        that.setData({
          classifyf_id: home_classify.id,
          classify_id: home_classify.id,
          classifys_id: '',
        });
        
      } else {
        that.setData({
          classifyf_id: home_classify.pid,
          classify_id: home_classify.id,
          classifys_id: home_classify.id
        });
    
      }
      wx.removeStorageSync('home_classify');
    }else{
    }

    //购物车对象
    wx.getStorage({
      key: 'cartsall',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok' && res.data) {
          that.setData({
            cartsall: res.data
          })
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

    //购物车数组
    wx.getStorage({
      key: 'cartsarr',
      success: function (res) {
        if (res.errMsg == 'getStorage:ok' && res.data) {
          that.setData({
            cartsarr: res.data
          })
        }
      }
    })

    var classify_id = this.data.classify_id;
    var classifyf_id = this.data.classifyf_id;
    var classifys_id = this.data.classifys_id;
    
    // 商品分类
    wx.request({
      url: util.realm_name +'api.php?c=Goods&a=goods_classify',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        pid: 0,
      },
      success: function (res) {
        if (res.data.code == 200) {
          if (classifyf_id){
            var fid = classifyf_id;
          }else {
            var fid = res.data.data[0].id;
          }
          
          // 子集分类
          wx.request({
            url: util.realm_name +'api.php?c=Goods&a=goods_classify',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
              pid: fid,
            },
            success: function (res) {
              if (res.data.code == 200) {
                that.setData({
                  classifysubsetlist: res.data.data,
                })
              }
            }
          })
          
          // 商品
          if (classify_id) {
            var cid = classify_id;
          } else if (fid){
            var cid = fid;
          }
      
          that.goodslist(cid, 1);

          that.setData({
            classifylist: res.data.data,
            classifyf_id: fid,
          })
        }
      }
    })

    

    
  },

  /**
   * 上拉触底
   */
  downpullloding: function () {
    var p = this.data.p + 1;
    var classify_id = this.data.classify_id;
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    this.goodslist(classify_id, p);
    
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
    wx.showLoading({
      title: '加载中',
    })
    this.initdata();
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
   * 子集分类
   */
  classifysubset: function (event) {
    wx.showLoading({
      title: '加载中',
    })
    var classify_id = event.currentTarget.dataset.classify_id;
    var that = this;
    that.setData({
      classifyf_id: classify_id,
      classify_id: classify_id,
      classifys_id: '',
    })

    //子集分类
    wx.request({
      url: util.realm_name +'api.php?c=Goods&a=goods_classify',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        pid: classify_id,
      },
      success: function (res) {
        
        if (res.data.code == 200) {
          that.setData({
            classifysubsetlist: res.data.data,
          })
        }
      }
    })

    //商品列表
    this.goodslist(classify_id, 1);
  },

  /** 
   * 商品列表
   */
  goodsclassify: function (event) {
    wx.showLoading({
      title: '加载中',
    })
    
    var classify_id = event.currentTarget.dataset.classify_id;
    var that = this;
    that.setData({
      classifys_id: (classify_id),
    })
    if (!classify_id){
      classify_id = this.data.classifyf_id
    }
    that.setData({
      classify_id: classify_id
    });
    
    this.goodslist(classify_id,1);
    
  },

  /**
   * 商品列表
   */

  goodslist: function (classify_id, p) {
    var that = this;
    if (p>1){
      that.setData({
        lodingtipstext: '加载中...',
        lodingtips: true,
      })
    }
    // 商品
    wx.request({
      url: util.realm_name +'api.php?c=Goods&a=goodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        p: p,
        classify_id: classify_id,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          var datas = res.data.data;
          if (p > 1) {
            var goodslist = that.data.goodslist.concat(datas);
          } else {
            var goodslist = datas;
          }
          that.setData({
            goodslist: goodslist,
            p: p
          })
          if (datas.length < 1) {
            that.setData({
              lodingtipstext: res.data.msg,
              lodingtips: true,
            })
          }else{
            that.setData({
              lodingtips: false,
            })
          }
        } else if (res.data.code == 203) {
          that.setData({
            lodingtipstext: res.data.msg,
            lodingtips: true,
          })
        }
      }
    })
  },

  /**
   * 购买数量加减
   */
  addcart:function(event){
    var clicktype = event.currentTarget.dataset.type;
    var id = event.currentTarget.dataset.id;
    var tins = this;
    var cartsall = this.data.cartsall;
    var cartsarr = this.data.cartsarr;//购物车商品添加顺序
    
    if (clicktype == "plus") {
      if (cartsall[id] != undefined ){
        cartsall[id]++;
      }else{
        cartsall[id] = 1
        cartsarr.unshift(id);
      }

    } else if (clicktype == "min") {
      if (cartsall[id] != undefined && cartsall[id] >= 0) {
        cartsall[id]--;
        if (cartsall[id] == 0) {
          var index = cartsarr.indexOf(id);
          if (index > -1) {
            cartsarr.splice(index, 1);
          }
          delete cartsall[id];
        }
      }
    }
    
    tins.setData({
      cartsall: cartsall,
      cartsarr: cartsarr
    })
    
    wx.setStorage({
      key: "cartsall",
      data: cartsall
    });

    wx.setStorage({
      key: "cartsarr",
      data: cartsarr
    });
    
    var arr = Object.keys(cartsall);
    var len = arr.length.toString();
    if (arr.length > 0){
      wx.setTabBarBadge({
        index: 3,
        text: len
      })
    }else{
      wx.removeTabBarBadge({
        index: 3,
      })
    }
  },

  /**
   * 库存不足提示
   */
  nostock:function(){
    wx.showToast({
      title: '库存不足！',
      icon: 'none',
      duration: 2000
    })
  }
})