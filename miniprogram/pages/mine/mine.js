const config = require('../../utils/config.js')
const util = require('../../utils/util.js')
const api = require('../../utils/api.js');
const app = getApp();

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthor: false,
    isVip: false,
    vipDesc: '申请VIP',
    showRedDot: '',
    signedDays: 0, //连续签到天数
    signed: 0,
    signedRightCount: 0,
    applyStatus: 0,
    totalPoints: 0,
    showVIPModal: false,
    signBtnTxt: "每日签到",
    iconList: [{
      icon: 'favorfill',
      color: 'orange',
      badge: 0,
      name: '我的收藏',
      bindtap: "bindCollect"
    }, {
      icon: 'likefill',
      color: 'red',
      badge: 0,
      name: '我的点赞',
      bindtap: "bindZan"
    }, {
      icon: 'brandfill',
      color: 'yellow',
      badge: 0,
      name: '我的资源',
      bindtap: "showResource"
    }, {
      icon: 'goodsfavor',
      color: 'orange',
      badge: 0,
      name: '我的积分',
      bindtap: "bindPoint"
    }],
    nickName: '微信用户',
    showZanShang: false,
    avatarUrl: defaultAvatarUrl,
    openId: ""
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    await this.getMemberInfo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    let showRedDot = wx.getStorageSync('showRedDot');

    that.setData({
      showRedDot: showRedDot,
      showZanShang: app.globalData.admin
    });
    await that.checkAuthor(app.globalData.openid)
    //await that.getMemberInfo()
  },

  /**
   * 展示打赏二维码
   * @param {} e 
   */
  showQrcode: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },

  /**
   * copy数据
   * @param {*} e 
   */
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
   * 跳转我的收藏
   * @param {*} e 
   */
  bindCollect: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=1'
    })
  },

  /**
   * 跳转修改头像和昵称
   * @param {*} e 
   */
  bindAvatar: async function (e) {
    var avatarUrl = encodeURIComponent(this.data.avatarUrl)
    wx.navigateTo({
      url: '../mine/avatar/avatar?avatarUrl=' + avatarUrl + '&nickName=' + this.data.nickName + '&openId=' + this.data.openId
    })
  },

  /**
   * 跳转我的点赞 
   * @param {*} e 
   */
  bindZan: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=2'
    })
  },

  /**
   * 后台设置
   * @param {} e 
   */
  showAdmin: async function (e) {
    wx.navigateTo({
      url: '../admin/index'
    })
  },

  /**
   * 历史版本
   * @param {} e 
   */
  showRelease: async function (e) {
    wx.navigateTo({
      url: '../mine/release/release'
    })
  },

  /**
   * 资源列表
   * @param {} e 
   */
  showResource: async function (e) {
    wx.navigateTo({
      url: '../mine/resource/resource'
    })
  },

  /**
   * 我的消息
   * @param {*} e 
   */
  bindNotice: async function (e) {
    wx.navigateTo({
      url: '../mine/notice/notice'
    })
  },

  /**
   * 签到列表
   * @param {*} e 
   */
  btnSigned: async function (e) {
    wx.navigateTo({
      url: '../mine/sign/sign?signedDays=' + this.data.signedDays + '&signed=' + this.data.signed + '&signedRightCount=' + this.data.signedRightCount
    })
  },

  /**
   * 我的积分
   * @param {} e 
   */
  bindPoint: async function (e) {
    wx.navigateTo({
      url: '../mine/point/point'
    })
  },

  /**
   * 关于
   * @param {} e 
   */
  bindAbout: async function (e) {
    wx.navigateTo({
      url: '../mine/about/about'
    })
  },

  /**
   * 验证是否是管理员
   */
  checkAuthor: async function (e) {
    let that = this;
    const value = wx.getStorageSync('isAuthor')
    if (value) {
      that.setData({
        isAuthor: value
      })
    } else {
      let res = await api.checkAuthor(e);
      wx.setStorageSync('isAuthor', res.result)
      that.setData({
        isAuthor: res.result
      })
    }
  },

  /**
   * 展示打赏二维码
   * @param {} e 
   */
  showMoneryUrl: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },

  /**
   * VIP申请
   * @param {*} e 
   */
  clickVip: async function (e) {
    let that = this
    if (that.data.isVip) {
      return;
    }

    if (that.data.applyStatus == 1) {
      wx.showToast({
        title: "已经申请，等待审核",
        icon: "none",
        duration: 3000
      });
      return;
    }

    that.setData({
      showVIPModal: true
    })
  },

  /**
   * 隐藏
   * @param {}} e 
   */
  hideModal: async function (e) {
    this.setData({
      showVIPModal: false
    })
  },

  /**
   * 正式提交
   */
  submitApplyVip: async function (accept, templateId, that) {
    try {

      wx.showLoading({
        title: '提交中...',
      })
      let info = {
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl,
        accept: accept,
        templateId: templateId
      }
      let res = await api.applyVip(info)
      if (res.result) {
        wx.showToast({
          title: "申请成功，等待审批",
          icon: "none",
          duration: 3000
        });
        this.setData({
          showVIPModal: false,
          applyStatus: 1
        })
      } else {
        wx.showToast({
          title: "程序出错啦",
          icon: "none",
          duration: 3000
        });
      }

      wx.hideLoading()
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      wx.hideLoading()
    }
  },

  /**
   * 申请VIP
   * @param {*} e 
   */
  applyVip: async function (e) {
    let that = this
    let tempalteId = config.vipApplyTemplateId
    wx.requestSubscribeMessage({
      tmplIds: [tempalteId],
      success(res) {
        that.submitApplyVip(res[tempalteId], tempalteId, that).then((res) => {
          console.info(res)
        })
      },
      fail(res) {
        wx.showToast({
          title: '程序有一点点小异常，操作失败啦',
          icon: 'none',
          duration: 1500
        })
      }
    })
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
   * 隐藏Modal
   * @param {} e 
   */
  hideModal(e) {
    this.setData({
      showVIPModal: false
    })
  },

  /**
   * 自定义分享
   */
  onShareAppMessage() {
    return {
      title: '有内容的小程序',
      imageUrl: 'https://6669-final-6gypsolb231307a9-1304273986.tcb.qcloud.la/others/share.jpg',
      path: '/pages/index/index'
    }
  },
})