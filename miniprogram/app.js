const config = require('/utils/config.js')
const util = require('/utils/util.js')

App({
  towxml: require('/towxml/index'),

  globalData: {
    openid: "",
    advert: {},
    lastLoginDate: "" //最后登录时间
  },

  // 同步获取openId，解决异步返回不同步的问题
  getOpenId: null,
  onLaunch: function () {

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: config.env
      })

      this.getOpenId = (function (that) {
        return new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'miniBlog',
            data: {
              type: 'initInfo'
            },
            success: res => {
              that.globalData.openid = res.result.openId
              that.globalData.userId = res.result.userId
              that.globalData.avatarUrl = res.result.avatarUrl
              that.globalData.nickName = res.result.nickName
              that.globalData.admin = res.result.admin
              console.log('[云函数] [login] 调用成功:', res.result.openId, res.result.userId, res.result.avatarUrl, res.result.nickName, that.globalData.admin)
              resolve({
                openId: res.result.openId,
                avatarUrl: res.result.avatarUrl,
                nickName: res.result.nickName
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        })
      })(this)
    }
    this.updateManager();
    // this.getAdvertConfig();
  },

  /**
   * 初始化最后登录时间
   */
  bindLastLoginDate: function () {
    var lastLoginDate = wx.getStorageSync('lastLoginDate');
    if (!lastLoginDate || util.formatTime(new Date()) != lastLoginDate) {
      wx.showTabBarRedDot({
        index: 1,
      })
    }
    this.globalData.lastLoginDate = util.formatTime(new Date())
    wx.setStorageSync('lastLoginDate', this.globalData.lastLoginDate);
  },

  /**
   * 小程序主动更新
   */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {});
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '有新版本',
        content: '新版本已经准备好，即将重启',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },

  /**
   * 获取广告信息（占坑）
   */
  getAdvertConfig: function () {
    const api = require('/utils/api.js')
    api.getAdvertConfig().then(res => {
      try {
        this.globalData.advert = res.result.value
      } catch (err) {
        console.info(err)
      }
    })
  },
})