const api = require('../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    page: 1,
    filter: "",
    nodata: false,
    nomore: false,
    defaultSearchValue: "",
    navItems: [{
      name: '最 新',
      index: 1
    }, {
      name: '热 门',
      index: 2
    }, {
      name: '标 签',
      index: 3
    }],
    swiperList: [],
    tabCur: 1,
    scrollLeft: 0,
    showHot: false,
    showLabels: false,
    hotItems: ["浏览最多", "评论最多", "点赞最多", "收藏最多"],
    hotCur: 0,
    labelList: [],
    labelCur: "全部",
    whereItem: ['', '_createTime', ''], //下拉查询条件
    loading: true,
    cancel: false,
    iconList: [{
      icon: 'github',
      color: 'mauve',
      badge: 0,
      name: '开源项目',
      bindtap: "openTopicGithub"
    }, {
      icon: 'formfill',
      color: 'red',
      badge: 0,
      name: '面试刷题',
      bindtap: "openTopicInterview"
    }, {
      icon: 'brandfill',
      color: 'yellow',
      badge: 0,
      name: '小 程 序',
      bindtap: "openTopicMini"
    }, {
      icon: 'goodsnewfill',
      color: 'orange',
      badge: 0,
      name: '积分商城',
      bindtap: "bindNotice"
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this
    //有openid增加分享积分
    if (options.openid) {
      let shareOpenId = options.openid
      let info = {
        shareOpenId: shareOpenId,
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl
      }
      await api.addShareDetail(info)
    }
    // 下拉背景字体、loading 图的样式为dark
    wx.setBackgroundTextStyle({
      textStyle: 'dark'
    })
    // 获取顶部SwiperList
    await this.getSwiperList()
    // 获取博客内容
    await that.getPostsList('', '_createTime')
  },

  /**
   * 跳转至专题详情
   * @param {} e 
   */
  openTopicGithub: async function (e) {
    wx.navigateTo({
      url: '../topic/topiclist/topiclist?classify=开源项目'
    })
  },

  /**
   * 跳转至专题详情
   * @param {} e 
   */
  openTopicInterview: async function (e) {
    wx.navigateTo({
      url: '../topic/topiclist/topiclist?classify=算法基础'
    })
  },
  /**
   * 跳转至专题详情
   * @param {} e 
   */
  openTopicMini: async function (e) {
    wx.navigateTo({
      url: '../topic/topiclist/topiclist?classify=小程序'
    })
  },

  /**
   * 跳转至专题详情
   * @param {} e 
   */
  bindNotice: async function (e) {
    wx.navigateTo({
      url: '../mine/notice/notice'
    })
  },

  /**
   * 获取SwiperList
   * @param {*} e 
   */
  getSwiperList: async function () {
    let that = this
    let swiperList = await api.getSwiperList(app.globalData.openid)
    that.setData({
      swiperList: swiperList.data
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    that.setData({
      page: 1,
      posts: [],
      filter: "",
      nomore: false,
      nodata: false,
      defaultSearchValue: "",
      tabCur: 1,
      showLabels: false,
      showHot: false,
      cancel: false,
      labelCur: "全部",
      hotCur: 0
    })
    await this.getPostsList('', '_createTime')
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    let whereItem = this.data.whereItem
    // let filter = this.data.filter
    await this.getPostsList(whereItem[0], whereItem[1], whereItem[2])
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '有内容的小程序',
      imageUrl: 'https://6669-final-6gypsolb231307a9-1304273986.tcb.qcloud.la/others/share.jpg',
      path: '/pages/index/index'
    }
  },

  /**
   * 点击文章明细
   */
  bindPostDetail: function (e) {
    let blogId = e.currentTarget.id;
    let dbName = e.currentTarget.dataset.db;
    wx.navigateTo({
      url: '../detail/detail?id=' + blogId + '&dbName=' + dbName
    })
  },

  /**
   * 搜索功能
   * @param {} e 
   */
  bindconfirm: async function (e) {
    let that = this;
    let page = 1
    that.setData({
      page: page,
      posts: [],
      filter: e.detail.value,
      nomore: false,
      nodata: false,
      whereItem: [e.detail.value, '_createTime', ''],
      cancel: true
    })
    await this.getPostsList(e.detail.value, '_createTime')
  },

  /**
   * tab切换
   * @param {} e 
   */
  tabSelect: async function (e) {
    let that = this;
    let tabCur = e.currentTarget.dataset.id
    switch (tabCur) {
      case 1: {
        that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          nomore: false,
          nodata: false,
          showHot: false,
          showLabels: false,
          defaultSearchValue: "",
          posts: [],
          page: 1,
          whereItem: ['', '_createTime', ''],
          cancel: false
        })

        await that.getPostsList("", '_createTime')
        break
      }
      case 2: {
        that.setData({
          posts: [],
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHot: true,
          showLabels: false,
          defaultSearchValue: "",
          page: 1,
          nomore: false,
          nodata: false,
          whereItem: ['', 'totalVisits', ''],
          cancel: false
        })
        await that.getPostsList("", "totalVisits")
        break
      }
      case 3: {
        that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHot: false,
          showLabels: true,
          nomore: false,
          nodata: false,
          posts: [],
          page: 1,
          cancel: false
        })

        await that.getPostsList("", '_createTime')
        let labelList = await api.getLabelList(app.globalData.openid, 1)
        that.setData({
          labelList: labelList.result.data
        })
        break
      }
    }
  },

  /**
   * 热门按钮切换
   * @param {*} e 
   */
  hotSelect: async function (e) {
    let that = this
    let hotCur = e.currentTarget.dataset.id
    let orderBy = "_createTime"
    switch (hotCur) {
      //浏览最多
      case 0: {
        orderBy = "totalVisits"
        break
      }
      //评论最多
      case 1: {
        orderBy = "totalComments"
        break
      }
      //点赞最多
      case 2: {
        orderBy = "totalZans"
        break
      }
      //收藏最多
      case 3: {
        orderBy = "totalCollection"
        break
      }
    }
    that.setData({
      posts: [],
      hotCur: hotCur,
      defaultSearchValue: "",
      page: 1,
      nomore: false,
      nodata: false,
      whereItem: ['', orderBy, '']
    })
    await that.getPostsList("", orderBy)
  },

  /**
   * 标签按钮切换
   * @param {*} e 
   */
  labelSelect: async function (e) {
    let that = this
    let labelCur = e.currentTarget.dataset.id
    that.setData({
      posts: [],
      labelCur: labelCur,
      defaultSearchValue: "",
      page: 1,
      nomore: false,
      nodata: false,
      whereItem: ['', '_createTime', labelCur == "全部" ? "" : labelCur]
    })

    await that.getPostsList("", "_createTime", labelCur == "全部" ? "" : labelCur)
  },

  /**
   * 获取文章列表
   */
  getPostsList: async function (filter, orderBy, label) {
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
    let result = await api.getPostsList(page, filter, 1, orderBy, label)
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
        posts: that.data.posts.concat(result.data),
        loading: false
      })
    }
  }

})