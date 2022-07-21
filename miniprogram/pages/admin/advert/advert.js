const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    advert: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getAdvertConfig()
  },

  getAdvertConfig: async function () {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      let result = await api.getAdvertConfig()
      this.setData({
        advert: result.result.value
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
    let advert = that.data.advert
    advert.readMoreStatus = e.detail.value.readMoreStatus
    advert.readMoreId = e.detail.value.readMoreId
    advert.bannerStatus = e.detail.value.bannerStatus
    advert.bannerId = e.detail.value.bannerId
    advert.taskVideoStatus = e.detail.value.taskVideoStatus
    advert.taskVideoId = e.detail.value.taskVideoId
    advert.pointsStatus = e.detail.value.pointsStatus
    advert.pointsId = e.detail.value.pointsId
    let result = await api.upsertAdvertConfig(advert, app.globalData.openid)
    if (result.result) {
      app.globalData.advert = advert
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

})