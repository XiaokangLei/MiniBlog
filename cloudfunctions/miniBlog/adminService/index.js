// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'final-6gypsolb231307a9'
})

// const rp = require('request-promise');
const dateUtils = require('date-utils')
const db = cloud.database()
const _ = db.command
const RELEASE_LOG_KEY = 'releaseLogKey'
const APPLY_TEMPLATE_ID = 'DI_AuJDmFXnNuME1vpX_hY2yw1pR6kFXPZ7ZAQ0uLOY'
const authorOpenId = 'oDlhc5ICcF_CLaQt9v_EoFgCnhZE'

// 云函数入口函数
exports.main = async (event, context) => {
  //admin服务都要验证一下权限
  if (event.action !== 'checkAuthor' && event.action !== 'getLabelList' && event.action !== 'getClassifyList' && event.action !== 'getAdvertConfig' && event.action != 'upsertShowConfig') {
    let result = await checkAuthor(event)
    if (!result) {
      return false;
    }
  }

  switch (event.action) {
    case 'checkAuthor': {
      return checkAuthor(event)
    }
    case 'addReleaseLog': {
      return addReleaseLog(event)
    }
    case 'updatePostsShowStatus': {
      return updatePostsShowStatus(event)
    }
    case 'updatePostsClassify': {
      return updatePostsClassify(event)
    }
    case 'updatePostsLabel': {
      return updatePostsLabel(event)
    }
    case 'upsertPosts': {
      return upsertPosts(event)
    }
    case 'addBaseLabel': {
      return addBaseLabel(event)
    }
    case 'addBaseClassify': {
      return addBaseClassify(event)
    }
    case 'deleteConfigById': {
      return deleteConfigById(event)
    }
    case 'changeCommentFlagById': {
      return changeCommentFlagById(event)
    }
    case 'getLabelList': {
      return getLabelList(event)
    }
    case 'getClassifyList': {
      return getClassifyList(event)
    }
    case 'deletePostById': {
      return deletePostById(event)
    }
    case 'updateBatchPostsLabel': {
      return updateBatchPostsLabel(event)
    }
    case 'updateBatchPostsClassify': {
      return updateBatchPostsClassify(event)
    }
    case 'upsertAdvertConfig': {
      return upsertAdvertConfig(event)
    }
    case 'getAdvertConfig': {
      return getAdvertConfig(event)
    }
    case 'approveApplyVip': {
      return approveApplyVip(event)
    }
    case 'upsertShowConfig': {
      return upsertShowConfig(event)
    }
    default:
      break
  }
}

/**
 * 管理员验证
 * @param {} event 
 */
async function checkAuthor(event) {
  // let authors = process.env.author
  // console.log("event:", event)
  // if (authors.indexOf(event.userInfo.openId) != -1) {
  if (event.openId == authorOpenId) {
    return true;
  }
  return false;
}

/**
 * 新增版本日志
 * @param {*} event 
 */
async function addReleaseLog(event) {
  try {
    let collection = 'mini_logs'
    let data = {
      key: RELEASE_LOG_KEY,
      tag: '【' + event.log.releaseName + '版本更新】',
      content: event.log,
      title: event.title,
      icon: 'formfill',
      color: 'blue',
      path: '../release/release',
      _createTime: Date.now(),
      datetime: new Date(Date.now()).toFormat("YYYY-MM-DD HH24:MI"),
      openId: '', //为空则为所有用户
      type: 'system'
    }
    await db.collection(collection).add({
      data: data
    })
    return true;
  } catch (e) {
    console.info(e)
    return false;
  }

}

/**
 * 更新文章展示状态
 * @param {*} event 
 */
async function updatePostsShowStatus(event) {
  try {
    await db.collection('mini_posts').doc(event.id).update({
      data: {
        isShow: event.isShow
      }
    })
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

/**
 * 更新文章专题名称
 * @param {*} event 
 */
async function updatePostsClassify(event) {
  try {
    await db.collection('mini_posts').doc(event.id).update({
      data: {
        classify: event.classify
      }
    })
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

/**
 * 更新文章专题名称
 * @param {*} event 
 */
async function updatePostsLabel(event) {
  try {
    await db.collection('mini_posts').doc(event.id).update({
      data: {
        label: event.label
      }
    })
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

/**
 * 新增or更新文章（占坑）
 * @param {*} event 
 */
async function upsertPosts(event) {
  try {
    let collection = "mini_posts"
    if (event.id === "") {
      await db.collection(collection).add({
        data: event.post
      });
    } else {
      await db.collection(collection).doc(event.id).update({
        data: event.post
      });
    }
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

/**
 * 新增基础标签
 * @param {*} event 
 */
async function addBaseLabel(event) {
  let key = "basePostsLabels"
  let collection = "mini_config"
  let labelValue = {
    'label': event.labelName
  }
  let result = await db.collection(collection).where({
    key: key,
    value: labelValue
  }).get()
  if (result.data.length > 0) {
    return false
  } else {
    await db.collection(collection).add({
      data: {
        key: key,
        _createTime: Date.now(),
        value: labelValue
      }
    });
    return true;
  }
}

/**
 * 获取广告配置（占坑）
 */
async function getAdvertConfig() {
  let key = "advertConfig"
  let collection = "mini_config"

  let result = await db.collection(collection).where({
    key: key
  }).get()

  return result.data[0]
}

/**
 * 新增广告配置
 * @param {*} event 
 */
async function upsertAdvertConfig(event) {
  let key = "advertConfig"
  let collection = "mini_config"
  let result = await db.collection(collection).where({
    key: key
  }).get()
  if (result.data.length > 0) {
    await db.collection(collection).doc(result.data[0]._id).update({
      data: {
        _updateTime: Date.now(),
        value: event.advert
      }
    });
    return true
  } else {
    await db.collection(collection).add({
      data: {
        key: key,
        _createTime: Date.now(),
        value: event.advert
      }
    });
    return true;
  }
}

/**
 * 更新Admin配置
 * @param {*} event 
 */
async function upsertShowConfig(event) {
  let key = "admin"
  let collection = "mini_config"
  let isShowList = {
    "isShow": event.isShow
  }
  let result = await db.collection(collection).where({
    key: key
  }).get()
  if (result.data.length > 0) {
    await db.collection(collection).doc(result.data[0]._id).update({
      data: {
        _updateTime: Date.now(),
        value: isShowList
      }
    });
    return true
  } else {
    await db.collection(collection).add({
      data: {
        key: key,
        _createTime: Date.now(),
        value: isShowList
      }
    });
    return true;
  }
}

/**
 * 新增基础专题
 * @param {} event 
 */
async function addBaseClassify(event) {
  let key = "basePostsClassify"
  let collection = "mini_config"
  let classifyData = {
    classifyName: event.classifyName,
    classifyDesc: event.classifyDesc
  }
  let result = await db.collection(collection).where({
    key: key,
    value: _.eq(classifyData)
  }).get()
  if (result.data.length > 0) {
    return false
  } else {
    await db.collection(collection).add({
      data: {
        key: key,
        _createTime: Date.now(),
        value: classifyData
      }
    });
    return true;
  }
}

/**
 * 根据id删除配置表数据
 * @param {*} event 
 */
async function deleteConfigById(event) {
  try {
    await db.collection('mini_config').doc(event.id).remove()
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

async function deletePostById(event) {
  try {
    await db.collection('mini_posts').doc(event.id).remove()
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

/**
 * 根据ID删除评论
 * @param {*} event 
 */
async function changeCommentFlagById(event) {
  try {
    let task1 = db.collection('mini_comments').doc(event.id).update({
      data: {
        flag: event.flag
      }
    })
    let task2 = db.collection('mini_posts').doc(event.postId).update({
      data: {
        totalComments: _.inc(event.count)
      }
    })
    await task1
    await task2
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

/**
 * 获取所有label集合
 * @param {*} event 
 */
async function getLabelList(event) {
  const MAX_LIMIT = 100
  const countResult = await db.collection('mini_config').where({
    key: 'basePostsLabels'
  }).count()
  const total = countResult.total
  if (total === 0) {
    return {
      data: [],
      errMsg: "no label data",
    }
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('mini_config').where({
      key: 'basePostsLabels'
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}

/**
 * 获取所有label集合
 * @param {*} event 
 */
async function getClassifyList(event) {
  const MAX_LIMIT = 100
  const countResult = await db.collection('mini_config').where({
    key: 'basePostsClassify'
  }).count()
  const total = countResult.total
  if (total === 0) {
    return {
      data: [],
      errMsg: "no classify data",
    }
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('mini_config').where({
      key: 'basePostsClassify'
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}

/**
 * 批量保存标签信息
 * @param {*} event 
 */
async function updateBatchPostsLabel(event) {
  console.info(event)
  for (let i = 0; i < event.posts.length; i++) {
    let result = await db.collection('mini_posts').doc(event.posts[i]).get()
    let oldLabels = result.data.label
    if (event.operate == 'add') {
      if (oldLabels.indexOf(event) > -1) {
        continue
      }
      await db.collection('mini_posts').doc(event.posts[i]).update({
        data: {
          label: _.push([event.label])
        }
      })
    } else if (event.operate == 'delete') {

      var index = oldLabels.indexOf(event.label);
      if (index == -1) {
        continue
      }
      oldLabels.splice(index, 1);

      await db.collection('mini_posts').doc(event.posts[i]).update({
        data: {
          label: oldLabels
        }
      })
    }
  }

  return true;
}

/**
 * 批量保存主题信息
 * @param {*} event 
 */
async function updateBatchPostsClassify(event) {
  for (let i = 0; i < event.posts.length; i++) {
    let result = await db.collection('mini_posts').doc(event.posts[i]).get()
    if (event.operate == 'add') {
      await db.collection('mini_posts').doc(event.posts[i]).update({
        data: {
          classify: event.classify
        }
      })
    } else if (event.operate == 'delete') {
      await db.collection('mini_posts').doc(event.posts[i]).update({
        data: {
          classify: ""
        }
      })
    }
  }

  return true;
}

/**
 * 审核会员状态
 * @param {*} event 
 */
async function approveApplyVip(event) {
  try {
    console.info("会员审批")
    console.info(event)
    //申请状态 0:默认 1:申请中 2:申请通过 3:申请驳回
    let applyStatus = 1
    let level = 1
    if (event.apply == 'pass') {
      applyStatus = 2
      level = 5
    } else if (event.apply == 'reject') {
      applyStatus = 3
    }
    await db.collection('mini_member').doc(event.id).update({
      data: {
        applyStatus: applyStatus,
        level: level,
        modifyTime: new Date().getTime()
      }
    });

    //通过后评论增加VIP
    if (event.apply == 'pass') {
      await db.collection('mini_comments').where({
          _openid: event.openId
        })
        .update({
          data: {
            isVip: true
          },
        })
    }

    var templateInfo = await db.collection('mini_subcribute').where({
      openId: event.openId,
      templateId: APPLY_TEMPLATE_ID
    }).limit(1).get()

    console.info(templateInfo)

    if (templateInfo.code) {
      return true;
    }
    if (!templateInfo.data.length) {
      return true;
    }

    await db.collection('mini_subcribute').doc(templateInfo.data[0]['_id']).remove()

    try {
      const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openId,
        page: 'pages/mine/mine',
        data: {
          phrase1: {
            value: event.apply == 'pass' ? "通过" : "驳回"
          },
          thing2: {
            value: "VIP申请"
          },
          thing5: {
            value: event.apply == 'pass' ? "恭喜成为VIP" : "没有打赏记录，不满足条件"
          }
        },
        templateId: APPLY_TEMPLATE_ID
      })
      console.log(result)
    } catch (err) {
      console.log(err)
    }

    return true;
  } catch (e) {
    console.error(e)
    return false
  }
}