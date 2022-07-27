const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    page: 1,
    nodata: false,
    nomore: false,
    classify: "",
    loading: true,
    labelCur: '',
    kindCur: '',
    kindList: [],
    labelList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    let classify = options.classify;
    that.setData({
      classify: classify
    })
    wx.setNavigationBarTitle({
      title: classify
    })
    await this.getPostsKind(classify)
  },

  /**
   * 获取文章列表
   */
  getPostsKind: async function (classify) {
    let that = this
    let result = await api.getNewPostsKind(classify)
    if (result.data.length > 0) {
      if (result.data[0].value['kinds']) {
        let labelList = await api.getNewPostsLable(result.data[0].value['kinds'][0])
        if(labelList.data.length > 0){
          that.setData({
            kindList: result.data[0].value['kinds'],
            kindCur: result.data[0].value['kinds'][0],
            labelList: labelList.data[0].value['label'],
            labelCur: labelList.data[0].value['label'][0]
          })
        }
        else{
          that.setData({
            nodata: true,
            loading: false
          })
        }
        
      } else {
        that.setData({
          nodata: true,
          loading: false
        })
      }

    } else {
      that.setData({
        nodata: true,
        loading: false
      })
    }
    await this.getPostsList(classify, that.data.kindCur, that.data.labelCur)

  },

  /**
   * 标签按钮切换
   * @param {*} e 
   */
  kindSelect: async function (e) {
    let that = this
    let kindCur = e.currentTarget.dataset.id
    let labelList = await api.getNewPostsLable(kindCur)
    let kind = []
    if (labelList.data.length > 0) {
      kind = labelList.data[0].value['label']
    }
    that.setData({
      posts: [],
      kindCur: kindCur,
      labelList: kind,
      labelCur: kind[0],
      defaultSearchValue: "",
      page: 1,
      nomore: false,
      nodata: false,
    })
    await that.getPostsList(that.data.classify, that.data.kindCur, that.data.labelCur)
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
    })
    await that.getPostsList(that.data.classify, that.data.kindCur, that.data.labelCur)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    let page = 1
    that.setData({
      page: page,
      posts: [],
      filter: "",
      nomore: false,
      nodata: false,
      defaultSearchValue: ""
    })
    await this.getPostsList(that.data.classify, that.data.kindCur, that.data.labelCur)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this.getPostsList(this.data.classify, that.data.kindCur, that.data.labelCur)
  },

  /**
   * 获取文章列表
   */
  getPostsList: async function (classify, kind, label) {
    let that = this
    let page = that.data.page
    let containLabel = 1
    if (!label) {
      containLabel = 2
    }
    let where = {
      classify: classify || '',
      kind: kind || '',
      label: label || '',
      containLabel: containLabel,
      containKind: 1,
      isShow: 1
    }
    let result = await api.getNewPostsList(page, where)
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
  },

  bindPostDetail: function (e) {
    let blogId = e.currentTarget.id;
    let dbName = e.currentTarget.dataset.db;
    wx.navigateTo({
      url: '../../detail/detail?id=' + blogId + '&dbName=' + dbName
    })
  }

})