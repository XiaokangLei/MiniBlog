const api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getClassifyList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    that.setData({
      classifyList: []
    })
    await this.getClassifyList()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取专题集合
   * @param {*} e 
   */
  getClassifyList: async function () {
    let that = this
    let classifyList = await api.getClassifyList()
    that.setData({
      classifyList: classifyList.result.data,
      loading: false
    })
  },

  /**
   * 跳转至专题详情
   * @param {} e 
   */
  openTopicPosts: async function (e) {
    let classify = e.currentTarget.dataset.tname;
    wx.navigateTo({
      url: '../topic/topiclist/topiclist?classify=' + classify
    })
  }
})