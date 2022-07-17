// pages/mine/resource/resource.js
const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: [],
    page: 1,
    nodata: false,
    nomore: false,
    loading: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getResourceList()

  },

  /**
   * 获取资源列表
   */
  getResourceList: async function (filter) {
    let that = this
    that.setData({
      loading: true
    })
    let page = that.data.page
    if (that.data.nomore) {
      that.setData({
        loading: false
      })
      return
    }
    let result = await api.getResourceList(page, app.globalData.openid)
    if (result.data.length === 0) {
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
        notice: that.data.notice.concat(result.data),
        loading: false
      })
    }
  },

  /**
   * 点击明细
   */
  bindDetail: function (e) {
    let blogId = e.currentTarget.id;
    let dbName = e.currentTarget.dataset.db;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + blogId + '&dbName=' + dbName
    })
  },

  bgCopy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.value,
      fail: function () {
        wx.showToast({
          title: '复制失败！',
          icon: 'none'
        })
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this.getResourceList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})