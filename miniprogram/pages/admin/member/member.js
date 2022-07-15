const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItems: [{
      name: '待审批',
      index: 0
    }, {
      name: '审批通过',
      index: 1
    }, {
      name: '审批驳回',
      index: 2
    }],
    tabCur: 0,
    scrollLeft: 0,
    btnColor: "red",
    btnName: "删除",
    members: [],
    page: 1,
    nodata: false,
    nomore: false,
    isCommentShow: false,
    curFlag: 0,
    curComment: "",
    curId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getMemberInfoList(1)
  },
  /**
   * tab切换
   * @param {} e 
   */
  tabSelect: async function (e) {
    let that = this;
    console.log(e);
    that.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      members: [],
      nomore: false,
      nodata: false,
      page: 1
    })
    await this.getMemberInfoList(e.currentTarget.dataset.id)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    let page = 1
    that.setData({
      page: page,
      members: [],
      nomore: false,
      nodata: false
    })
    await this.getMemberInfoList(that.data.tabCur + 1)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this.getMemberInfoList(this.data.tabCur + 1)
  },
  /**
   * 获取文章列表
   */
  getMemberInfoList: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    let result = await api.getMemberInfoList(page, that.data.tabCur + 1)
    if (result.data.length === 0) {
      that.setData({
        nomore: true
      })
      if (page === 1) {
        that.setData({
          nodata: true
        })
      }
    } else {
      that.setData({
        page: page + 1,
        members: that.data.members.concat(result.data),
      })
    }
    wx.hideLoading()
  },
  /**
   * 隐藏
   * @param {*} e 
   */
  hideCommentModal(e) {
    this.setData({
      isCommentShow: false,
      curId: "",
      curFlag: 0,
      curComment: ""
    })
  },
  /**
   * 显示
   * @param {} e 
   */
  showCommentModal(e) {
    console.info(e)
    let curId = e.currentTarget.id
    let curFlag = e.currentTarget.dataset.flag
    let curComment = e.currentTarget.dataset.comment
    this.setData({
      isCommentShow: true,
      curId: curId,
      curFlag: curFlag,
      curComment: curComment
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        curId: e.currentTarget.id
      })
    } else {
      this.setData({
        curId: ""
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  /**
   * 删除评论
   * @param {*} e 
   */
  changeMemberApplyStatus: async function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this
      let memberId = e.currentTarget.id
      let status = e.currentTarget.dataset.status
      let openId = e.currentTarget.dataset.openid
      console.info(memberId)
      console.info(status)
      console.log(that.data.members)
      let res = await api.approveApplyVip(memberId, status, openId)
      console.info(res)
      if (res.result) {
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: '操作发生未知异常',
          duration: 1500
        })
      }
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
    } finally {
      wx.hideLoading()
      this.onPullDownRefresh()
    }
  }
})