// pages/admin/isShow/isshow.js
const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getAdmin()
  },

  getAdmin: async function () {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      let result = await api.getAdmin()
      this.setData({
        isShow: result.data[0].value['isShow']
      })
    } catch (err) {
      console.info(err)
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 保存
   * @param {} e 
   */
  formSubmit: async function (e) {
    let that = this
    let isShow = that.data.isShow
    isShow = e.detail.value.isShowStatus
    let result = await api.upsertShowConfig(isShow, app.globalData.openid)
    console.info(result)
    if (result.result) {
      app.globalData.admin = isShow
      wx.showToast({
        title: "保存成功",
        icon: "none",
        duration: 2000
      });
    } else {
      wx.showToast({
        title: "保存失败",
        icon: "none",
        duration: 2000
      });
    }
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
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})