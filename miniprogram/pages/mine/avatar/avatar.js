// pages/mine/avatar/avatar.js
const config = require('../../../utils/config.js')
const db = wx.cloud.database()
const _ = db.command
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头像图片地址
    avatarUrl: '',
    // 昵称
    nickName: '',
    // 用户openid
    openId: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      avatarUrl: decodeURIComponent(options.avatarUrl),
      nickName: options.nickName,
      openId: options.openId
    })
  },

  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '/pages/mine/mine'
    })
  },

  /**
   * 提交修改内容
   */
  formSubmit(e) {
    var that = this;
    if (e.detail.value.input != '') {
      that.setData({
        nickName: e.detail.value.input
      })
    }
    wx.cloud.uploadFile({
      // 文件名
      cloudPath: that.data.openId + '.png',
      // 文件路径
      filePath: that.data.avatarUrl,
      success: res => {
        // get resource ID res.fileID
        that.addImagePath(res.fileID)
      },
      fail: err => {
        that.addImagePath(config.fileIdPre + that.data.openId + '.png')
      }
    })
  },

  /**
   * 上传图片，获取上传后的http地址
   */
  addImagePath(fileId) {
    // 获取图片上传后的https的url路径地址  参数是上传图片的 fileId
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        this.setData({
          imgrl: res.fileList[0].tempFileURL
        })
        this.upload(this.data.imgrl)
      },
      fail: console.error
    })
  },

  /**
   * 同时更新用户其他数据库中的信息
   */
  upload(filepath) {
    wx.showLoading({
      title: '更新中...',
    })
    db.collection("mini_member").where({
        _openid: this.data.openId
      }).update({
        data: {
          nickName: this.data.nickName,
          avatarUrl: filepath + '?random=' + (new Date()).valueOf()
        }
      }).then(res => {
        console.log(res)
      }),

      db.collection("mini_comments").where({
        _openid: this.data.openId
      }).update({
        data: {
          cNickName: this.data.nickName,
          cAvatarUrl: filepath + '?random=' + (new Date()).valueOf()
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          this.navigateBack()
        }, 1100)
      })
  },

  /**
   * 选择微信头像或上传其他图片
   */
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
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