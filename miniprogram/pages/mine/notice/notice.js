const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js')
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
    totalPoints: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.setStorageSync('showRedDot', '1');
    await this.getMemberInfo()
    await this.getNoticeLogsList()
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
    await this.getNoticeLogsList()
  },

  /**
   * 消息详情
   */
  bindDetail: function (e) {
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path
    })
  },

  /**
   * 获取消息列表
   */
  getNoticeLogsList: async function (filter) {
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
    let result = await api.getNoticeLogsList(page, '')
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
   * 获取用户信息
   * @param {} e 
   */
  getMemberInfo: async function (e) {

    let that = this
    try {
      let res = await api.getMemberInfo(app.globalData.openid)
      if (res.data.length > 0) {
        let memberInfo = res.data[0]
        that.setData({
          signedDays: memberInfo.continueSignedCount,
          signed: util.formatTime(new Date()) == memberInfo.lastSignedDate ? 1 : 0,
          signBtnTxt: util.formatTime(new Date()) == memberInfo.lastSignedDate ? "今日已签到" : "每日签到",
          vipDesc: Number(memberInfo.level) > 1 ? "VIP用户" : "申请VIP",
          isVip: Number(memberInfo.level) > 1,
          applyStatus: memberInfo.applyStatus,
          signedRightCount: memberInfo.sighRightCount == undefined ? 0 : memberInfo.sighRightCount,
          nickName: memberInfo.nickName,
          avatarUrl: memberInfo.avatarUrl,
          openId: memberInfo._openid,
          totalPoints: memberInfo.totalPoints
        })
      }
    } catch (e) {
      console.info(e)
    }
  },

  /**
   * 积分兑换
   * @param {*} e 
   */
  clickPoint: function (e) {
    let that = this
    if (that.data.totalPoints < e.currentTarget.dataset.points) {
      wx.showToast({
        title: "很抱歉，您的积分不够",
        icon: "none",
        duration: 4000
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '您将花费' + e.currentTarget.dataset.points + '积分兑换【' + e.currentTarget.dataset.title + '】' + '是否确认兑换?',
      success(res) {
        if (res.confirm) {
          // wx.showLoading({
          //   title: '处理中...',
          // })
          let info = {
            nickName: app.globalData.nickName,
            avatarUrl: app.globalData.avatarUrl,
          }
          api.addPoints('', info, e.currentTarget.dataset.points, '兑换【' + e.currentTarget.dataset.title + '】').then((res) => {
            if (res.result) {
              that.setData({
                totalPoints: Number(that.data.totalPoints) - e.currentTarget.dataset.points
              })
              that.postAdd(e.currentTarget.dataset.id, e.currentTarget.dataset.title, e.currentTarget.dataset.baidu, e.currentTarget.dataset.url)
              // wx.showToast({
              //   title: "兑换成功",
              //   icon: "none",
              //   duration: 3000
              // });
            } else {
              wx.showToast({
                title: "程序有些小异常",
                icon: "none",
                duration: 3000
              });
            }

          })
          // wx.hideLoading()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 增加兑换
   */
  postAdd: async function (resourceId, resourceTitle, resourceBaidu, resourceUrl) {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      let data = {
        resourceId: resourceId,
        resourceTitle: resourceTitle,
        resourceBaidu: resourceBaidu,
        resourceUrl: resourceUrl,
        openId: app.globalData.openid,
      }
      await api.addResource(data)
      wx.hideLoading()
      wx.showToast({
        title: '兑换成功',
        icon: 'success',
        duration: 1400
      })
      await that.showResource()
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1400
      })
      console.info(err)
      wx.hideLoading()
    } finally {

    }

  },

  /**
   * 资源列表
   * @param {} e 
   */
  showResource: async function (e) {
    setTimeout(function () {
      wx.navigateTo({
        url: '../resource/resource'
      })
    }, 1500);
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

})