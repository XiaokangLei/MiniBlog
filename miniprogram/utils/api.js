const db = wx.cloud.database()
const _ = db.command

/**
 * 获取分享明细
 * @param {} openId 
 * @param {*} date 
 */
function getShareDetailList(openId, date) {
  return db.collection('mini_share_detail')
    .where({
      shareOpenId: openId,
      date: date
    })
    .limit(5)
    .get()
}

/**
 * 获取会员信息
 * @param {} openId 
 */
function getMemberInfo(openId) {
  return db.collection('mini_member')
    .where({
      _openid: openId
    })
    .limit(1)
    .get()
}

/**
 * 获取会员列表
 * @param {*} applyStatus 
 * @param {*} page 
 */
function getMemberInfoList(page, applyStatus) {
  return db.collection('mini_member')
    .where({
      applyStatus: applyStatus
    })
    .orderBy('modifyTime', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取积分明细列表
 * @param {*} page 
 * @param {*} openId 
 */
function getPointsDetailList(page, openId) {
  return db.collection('mini_point_detail')
    .where({
      openId: openId
    })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * 20)
    .limit(20)
    .get()
}

/**
 * 获取评论列表
 */
function getCommentsList(page, flag) {
  return db.collection('mini_comments')
    .where({
      flag: flag
    })
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 根据id获取文章明细
 * @param {*} page 
 */
function getPostsById(id) {
  return db.collection('mini_posts')
    .doc(id)
    .get()
}

/**
 * 获取消息列表
 * @param {*} page 
 */
function getNoticeLogsList(page, openId) {
  return db.collection('mini_resource')
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取已兑换列表
 * @param {*} page 
 */
function getResourceList(page, openId) {
  return db.collection('mini_resource_related')
    .where({
      openId: openId
    })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取版本发布日志
 * @param {*} page 
 */
function getReleaseLogsList(page) {
  return db.collection('mini_logs')
    .where({
      key: 'releaseLogKey'
    })
    .orderBy('_createTime', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

function getNewPostsList(page, filter, orderBy) {
  let where = {}
  if (filter.title != undefined) {
    where.title = db.RegExp({
      regexp: filter.title,
      options: 'i',
    })
  }
  if (filter.isShow != undefined) {
    where.isShow = filter.isShow
  }
  if (filter.classify != undefined) {
    where.classify = filter.classify
  }

  if (filter.hasClassify == 1) {
    where.classify = _.nin(["", 0, undefined])
  }

  if (filter.hasClassify == 2) {
    where.classify = _.in(["", 0, undefined])
  }

  if (orderBy == undefined || orderBy == "") {
    orderBy = "createTime"
  }

  if (filter.hasLabel == 1) {
    where.label = _.neq([])
  }

  if (filter.hasLabel == 2) {
    where.label = _.eq([])
  }

  //不包含某个标签
  if (filter.containLabel == 2) {
    where.label = _.nin([filter.label])
  }

  //包含某个标签
  if (filter.containLabel == 1) {
    where.label = db.RegExp({
      regexp: filter.label,
      options: 'i',
    })
  }

  //不包含某个类别
  if (filter.containKind == 2) {
    where.kind = _.nin([filter.kind])
  }

  //包含某个类别
  if (filter.containKind == 1) {
    where.kind = db.RegExp({
      regexp: filter.kind,
      options: 'i',
    })
  }

  //不包含某个主题
  if (filter.containClassify == 2) {
    where.classify = _.neq(filter.classify)
  }

  //包含某个主题
  if (filter.containClassify == 1) {
    where.classify = _.eq(filter.classify)
  }

  return db.collection('mini_posts')
    .where(where)
    .orderBy(orderBy, 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .field({
      _id: true,
      author: true,
      createTime: true,
      defaultImageUrl: true,
      title: true,
      totalComments: true,
      totalVisits: true,
      totalZans: true,
      isShow: true,
      classify: true,
      label: true,
      digest: true,
      info: true,
      abstract: true,
      _createTime: true
    }).get()
}

function getNewPostsKind(classify) {
  
  return db.collection('mini_config')
    .where({
      'value.classifyName': classify
      })
    .get()
}
function getNewPostsLable(kind) {
  
  return db.collection('mini_config')
    .where({
      'value.kind': kind
      })
    .get()
}

/**
 * 获取文章列表
 * @param {} page 
 */
function getPostsList(page, filter, isShow, orderBy, label) {
  let where = {}
  if (filter !== '') {
    where.title = db.RegExp({
      regexp: filter,
      options: 'i',
    })
  }
  if (isShow !== -1) {
    where.isShow = isShow
  }

  if (orderBy == undefined || orderBy == "") {
    orderBy = "_createTime"
  }

  if (label != undefined && label != "") {
    where.label = db.RegExp({
      regexp: label,
      options: 'i',
    })
  }

  return db.collection('mini_posts')
    .where(where)
    .orderBy(orderBy, 'desc')
    .skip((page - 1) * 6)
    .limit(6)
    .field({
      _id: true,
      defaultImageUrl: true,
      title: true,
      totalComments: true,
      totalVisits: true,
      totalZans: true,
      classify: true,
      label: true,
      abstract: true,
      _createTime: true
    }).get()

}

/**
 * 获取评论列表
 * @param {} page 
 * @param {*} postId 
 */
function getPostComments(page, postId) {
  return db.collection('mini_comments')
    .where({
      postId: postId,
      flag: 0
    })
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取收藏、点赞列表
 * @param {} page 
 */
function getPostRelated(where, page) {
  return db.collection('mini_posts_related')
    .where(where)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取文章详情
 * @param {} id 
 */
function getPostDetail(id, dbName) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "getPostsDetail",
      id: id,
      dbName: dbName,
      typeKind: 1
    }
  })
}

/**
 * 新增用户收藏文章
 */
function addPostCollection(data) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "addPostCollection",
      postId: data.postId,
      postTitle: data.postTitle,
      postUrl: data.postUrl,
      postDigest: data.postDigest,
      typeKind: data.type,
      postClassify: data.postClassify,
      openId: data.openId
    }
  })
}

/**
 * 取消喜欢或收藏
 */
function deletePostCollectionOrZan(postId, type, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "deletePostCollectionOrZan",
      postId: postId,
      typeKind: type,
      openId: openId
    }
  })
}

/**
 * 新增评论
 */
function addPostComment(commentContent, accept) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "addPostComment",
      commentContent: commentContent,
      accept: accept
    }
  })
}

/**
 * 新增用户点赞
 * @param {} data 
 */
function addPostZan(data) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "addPostZan",
      postId: data.postId,
      postTitle: data.postTitle,
      postUrl: data.postUrl,
      postDigest: data.postDigest,
      typeKind: data.type,
      postClassify: data.postClassify,
      openId: data.openId
    }
  })
}

/**
 * 新增积分兑换的资源
 * @param {} data 
 */
function addResource(data) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "addResource",
      resourceId: data.resourceId,
      resourceTitle: data.resourceTitle,
      resourceBaidu: data.resourceBaidu,
      resourceUrl: data.resourceUrl,
      openId: data.openId
    }
  })
}

/**
 * 新增子评论
 * @param {} id 
 * @param {*} comments 
 */
function addPostChildComment(id, postId, comments, accept) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "addPostChildComment",
      id: id,
      comments: comments,
      postId: postId,
      accept: accept
    }
  })
}

/**
 * 新增文章二维码并返回临时url
 * @param {*} id 
 * @param {*} postId 
 * @param {*} comments 
 */
function addPostQrCode(postId, timestamp, dbName) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "addPostQrCode",
      timestamp: timestamp,
      dbName: dbName,
      postId: postId
    }
  })
}

/**
 * 评论内容安全审核
 * @param {*} content 
 */
function checkPostComment(content) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'postsService',
      action: "checkPostComment",
      content: content
    }
  })
}

/**
 * 获取打赏码
 */
function getQrCode() {
  return wx.cloud.getTempFileURL({
    fileList: [{
      fileID: 'cloud://test-91f3af.54ec-test-91f3af/common/1556347401340.jpg'
    }]
  })
}

/**
 * 获取海报的文章二维码url
 * @param {*} id 
 */
function getReportQrCodeUrl(id) {
  return wx.cloud.getTempFileURL({
    fileList: [{
      fileID: id,
      maxAge: 60 * 60, // one hour
    }]
  })
}

/**
 * 验证是否是管理员
 */
function checkAuthor(openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "checkAuthor",
      openId: openId
    }
  })
}

/**
 * 新增版本日志
 * @param {} log 
 */
function addReleaseLog(log, title, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "addReleaseLog",
      log: log,
      title: title,
      openId: openId
    }
  })
}

/**
 * 更新文章状态
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsShowStatus(id, isShow, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "updatePostsShowStatus",
      id: id,
      isShow: isShow,
      openId: openId
    }
  })
}

/**
 * 更新文章专题
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsClassify(id, classify, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "updatePostsClassify",
      id: id,
      classify: classify,
      openId: openId
    }
  })
}

/**
 * 更新文章标签
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsLabel(id, label, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "updatePostsLabel",
      id: id,
      label: label,
      openId: openId
    }
  })
}

/**
 * 更新文章标签
 * @param {*} id 
 * @param {*} isShow 
 */
function upsertPosts(id, data, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "upsertPosts",
      id: id,
      post: data,
      openId: openId
    }
  })
}

/**
 * 新增基础标签
 */
function addBaseLabel(labelName, openId, kind) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "addBaseLabel",
      labelName: labelName,
      kind: kind,
      openId: openId
    }
  })
}

/**
 * 新增基础主题
 */
function addBaseClassify(classifyName, classifyDesc, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "addBaseClassify",
      classifyName: classifyName,
      classifyDesc: classifyDesc,
      openId: openId
    }
  })
}

/**
 * 删除配置
 */
function deleteConfigById(id, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "deleteConfigById",
      id: id,
      openId: openId
    }
  })
}

/**
 * 删除文章
 */
function deletePostById(id, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "deletePostById",
      id: id,
      openId: openId
    }
  })
}

/**
 * 更新评论状态
 * @param {*} id 
 * @param {*} flag 
 */
function changeCommentFlagById(id, flag, postId, count, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "changeCommentFlagById",
      id: id,
      flag: flag,
      postId: postId,
      count: count,
      openId: openId
    }
  })
}

/**
 * 获取label集合
 */
function getLabelList(openId, kind) {

  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "getLabelList",
      kind: kind,
      openId: openId
    }
  })
}

/**
 * 获取Classify集合
 */
function getClassifyList() {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "getClassifyList"
    }
  })
}

/**
 * 更新Classify集合
 */
function updateBatchPostsClassify(classify, operate, posts, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "updateBatchPostsClassify",
      posts: posts,
      operate: operate,
      classify: classify,
      openId: openId
    }
  })
}

/**
 * 更新label集合
 */
function updateBatchPostsLabel(label, operate, posts, openId, kind) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "updateBatchPostsLabel",
      posts: posts,
      operate: operate,
      label: label,
      kind: kind,
      openId: openId
    }
  })
}

function upsertAdvertConfig(advert) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "upsertAdvertConfig",
      advert: advert
    }
  })
}

function upsertShowConfig(isShow) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "upsertShowConfig",
      isShow: isShow
    }
  })
}

/**
 * 更新广告配置
 */
function getAdvertConfig() {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "getAdvertConfig"
    }
  })
}

/**
 * 新增签到
 */
function addSign(info) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'memberService',
      action: "addSign",
      info: info
    }
  })
}

/**
 * 补充签到
 */
function addSignAgain(info) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'memberService',
      action: "addSignAgain",
      info: info
    }
  })
}

/**
 * 新增积分
 */
function addPoints(taskType, info, point, oper) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'memberService',
      action: "addPoints",
      taskType: taskType,
      info: info,
      point: point,
      oper: oper
    }
  })
}

/**
 * 分享得积分
 * @param {*} info 
 */
function addShareDetail(info) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'memberService',
      action: "addShareDetail",
      info: info
    }
  })
}

/**
 * 申请VIP
 * @param {}}  
 */
function applyVip(info) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'memberService',
      action: "applyVip",
      info: info
    }
  })
}

/**
 * 审核vip
 * @param id
 */
function approveApplyVip(id, apply, openId) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'adminService',
      action: "approveApplyVip",
      id: id,
      apply: apply,
      openId: openId
    }
  })
}

/**
 * 获取登录详情
 * @param id
 */
function getSignedDetail(openId, year, month) {
  return wx.cloud.callFunction({
    name: 'miniBlog',
    data: {
      type: 'memberService',
      action: "getSignedDetail",
      openId: openId,
      year: year,
      month: month
    }
  })
}

/**
 * 上传文件
 */
function uploadFile(cloudPath, filePath) {
  return wx.cloud.uploadFile({
    cloudPath: cloudPath,
    filePath: filePath, // 文件路径
  })
}

/**
 * 获取打赏码
 */
function getTempUrl(fileID) {
  return wx.cloud.getTempFileURL({
    fileList: [{
      fileID: fileID
    }]
  })
}

/**
 * 获取swiperList
 * @param {} openId 
 */
function getSwiperList() {
  return db.collection('mini_swiper')
    .limit(5)
    .get()
}

function getAdmin() {
  return db.collection('mini_config')
    .where({
      key: "admin"
    })
    .get()
}

module.exports = {
  getPostsList: getPostsList,
  getPostDetail: getPostDetail,
  getPostRelated: getPostRelated,
  getQrCode: getQrCode,
  addPostCollection: addPostCollection,
  addPostZan: addPostZan,
  deletePostCollectionOrZan: deletePostCollectionOrZan,
  addPostComment: addPostComment,
  getPostComments: getPostComments,
  addPostChildComment: addPostChildComment,
  getReportQrCodeUrl: getReportQrCodeUrl,
  addPostQrCode: addPostQrCode,
  checkAuthor: checkAuthor,
  addReleaseLog: addReleaseLog,
  getReleaseLogsList: getReleaseLogsList,
  getNoticeLogsList: getNoticeLogsList,
  getPostsById: getPostsById,
  deleteConfigById: deleteConfigById,
  addBaseClassify: addBaseClassify,
  addBaseLabel: addBaseLabel,
  upsertPosts: upsertPosts,
  // updatePostsLabel: updatePostsLabel,
  // updatePostsClassify: updatePostsClassify,
  updatePostsShowStatus: updatePostsShowStatus,
  getCommentsList: getCommentsList,
  changeCommentFlagById: changeCommentFlagById,
  getLabelList: getLabelList,
  getClassifyList: getClassifyList,
  getNewPostsList: getNewPostsList,
  getNewPostsKind: getNewPostsKind,
  getNewPostsLable: getNewPostsLable,
  deletePostById: deletePostById,
  uploadFile: uploadFile,
  getTempUrl: getTempUrl,
  updateBatchPostsLabel: updateBatchPostsLabel,
  updateBatchPostsClassify: updateBatchPostsClassify,
  checkPostComment: checkPostComment,
  upsertAdvertConfig: upsertAdvertConfig,
  getAdvertConfig: getAdvertConfig,
  addSign: addSign,
  getMemberInfo: getMemberInfo,
  getSignedDetail: getSignedDetail,
  addPoints: addPoints,
  applyVip: applyVip,
  approveApplyVip: approveApplyVip,
  getMemberInfoList: getMemberInfoList,
  addShareDetail: addShareDetail,
  getShareDetailList: getShareDetailList,
  getPointsDetailList: getPointsDetailList,
  addSignAgain: addSignAgain,
  getSwiperList: getSwiperList,
  addResource: addResource,
  getResourceList: getResourceList,
  getAdmin: getAdmin,
  upsertShowConfig: upsertShowConfig
}