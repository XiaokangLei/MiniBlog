const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // navItems: [{ name: '我的收藏', index: 1 }, { name: '我的点赞', index: 2 }],
    tabCur: 1,
    scrollLeft: 0,
    page: 1,
    timeDesc: "",
    postRelated: [],
    nodata: false,
    nomore: false,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let type = options.type;
    let that = this;
    if (type === "1") {
      that.setData({
        tabCur: type,
        timeDesc: "收藏时间："
      })
      wx.setNavigationBarTitle({
        title: "我的收藏"
      })

    } else {
      that.setData({
        tabCur: type,
        timeDesc: "点赞时间："
      })
      wx.setNavigationBarTitle({
        title: "我的点赞"
      })
    }
    await this.getPostRelated(parseInt(type))
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    let that = this
    await that.getPostRelated(that.data.tabCur)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击文章明细
   */
  bindPostDetail: function (e) {
    let blogId = e.currentTarget.id;
    let dbName = e.currentTarget.dataset.db;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + blogId + '&dbName=' + dbName
    })
  },
  /**
   * 获取收藏或喜欢列表
   */
  getPostRelated: async function (type) {
    let that = this;
    that.setData({
      loading: true
    })
    let page = that.data.page;
    let where = {
      type: type,
      openId: app.globalData.openid
    };
    let postRelated = await api.getPostRelated(where, page)
    if (postRelated.data.length === 0) {
      that.setData({
        nomore: true,
        loading: false
      })
      if (page === 1) {
        that.setData({
          nodata: true,
          loading: false
        })
      }
    } else {
      that.setData({
        page: page + 1,
        postRelated: that.data.postRelated.concat(postRelated.data),
        loading: false
      })
    }
  }

})