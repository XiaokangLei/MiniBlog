const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isReleaseShow: false,
    release: {
      releaseName: '',
      releaseDate: util.formatTime(new Date()),
      releaseContent: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {},

  /**
   * 隐藏
   * @param {*} e 
   */
  hideFormModal(e) {
    this.setData({
      isShow: false
    })
  },

  /**
   * 隐藏
   * @param {*} e 
   */
  hideReleaseModal(e) {
    this.setData({
      isReleaseShow: false
    })
  },

  /**
   * 显示
   * @param {} e 
   */
  showFormModal(e) {
    this.setData({
      isShow: true
    })
  },

  /**
   * 显示
   * @param {} e 
   */
  showReleaseModal(e) {
    this.setData({
      isReleaseShow: true
    })
  },

  /**
   * 保存发布版本
   * @param {*} e 
   */
  formRelaeaseSubmit: async function (e) {
    let that = this;
    let releaseName = e.detail.value.releaseName;
    let releaseDate = e.detail.value.releaseDate;
    let releaseContent = e.detail.value.releaseContent;
    if (releaseName === undefined ||
      releaseName === "" ||
      releaseDate === undefined ||
      releaseDate === "" ||
      releaseContent === undefined ||
      releaseContent === "") {
      wx.showToast({
        title: '请填写正确的表单信息',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showLoading({
        title: '保存中...',
      })

      let log = {
        releaseName: releaseName,
        releaseDate: releaseDate,
        releaseContent: releaseContent.split("\n")
      }

      let title = '小程序更新啦，赶紧来看看吧'
      let res = await api.addReleaseLog(log, title, app.globalData.openid)
      wx.hideLoading()
      if (res.result) {
        that.setData({
          isReleaseShow: false,
          release: {
            releaseName: '',
            releaseDate: util.formatTime(new Date()),
            releaseContent: ''
          }
        })

        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: '保存出错，请查看云函数日志',
          icon: 'none',
          duration: 1500
        })
      }
    }
  },

  /**
   * 跳转文章编辑
   * @param {*} e 
   */
  showArticle: async function (e) {
    wx.navigateTo({
      url: '../admin/articleList/articleList'
    })
  },

  /**
   * 跳转标签列表
   * @param {*} e 
   */
  showLabel: async function (e) {
    wx.navigateTo({
      url: '../admin/labelList/labelList'
    })
  },

  /**
   * 跳转到评论列表
   * @param {*} e 
   */
  showComment: async function (e) {
    wx.navigateTo({
      url: '../admin/comment/comment'
    })
  },

  /**
   * 跳转到专题列表
   * @param {*} e 
   */
  showClassify: async function (e) {
    wx.navigateTo({
      url: '../admin/classify/classify'
    })
  },

  showAdvert: async function (e) {
    wx.navigateTo({
      url: '../admin/advert/advert'
    })
  },

  isShow: async function (e) {
    wx.navigateTo({
      url: '../admin/isShow/isshow'
    })
  },

  showMember: async function (e) {
    wx.navigateTo({
      url: '../admin/member/member'
    })
  },
})