const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs: [],
    page: 1,
    nodata: false,
    nomore: false,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getReleaseLogs()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this.getReleaseLogs()
  },

  /**
   * 获取版本发布日志
   */
  getReleaseLogs: async function () {
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
    let result = await api.getReleaseLogsList(page)
    console.info(result)
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
        logs: that.data.logs.concat(result.data),
        loading: false
      })
    }
    wx.hideLoading()
  }
})