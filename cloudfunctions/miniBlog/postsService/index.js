// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'final-6gypsolb231307a9'
})

const Towxml = require('towxml');
const db = cloud.database()
const _ = db.command
const dateUtils = require('date-utils')

const towxml = new Towxml();
const COMMENT_TEMPLATE_ID = '10XxRQC7TIOQTjdDWczTF8Bokgwkd9pkE0j7EiGW8eM'

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getPostsDetail': {
      return getPostsDetail(event)
    }
    case 'addPostComment': {
      return addPostComment(event)
    }
    case 'addPostChildComment': {
      return addPostChildComment(event)
    }
    case 'addPostCollection': {
      return addPostCollection(event)
    }
    case 'deletePostCollectionOrZan': {
      return deletePostCollectionOrZan(event)
    }
    case 'addPostZan': {
      return addPostZan(event)
    }
    case 'addPostQrCode': {
      return addPostQrCode(event)
    }
    case 'checkPostComment': {
      return checkPostComment(event)
    }
    case 'addResource': {
      return addResource(event)
    }
    default:
      break
  }
}

/**
 * 新增文章二维码
 * @param {} event 
 */
async function addPostQrCode(event) {
  let scene = 'timestamp=' + event.timestamp;
  let result = await cloud.openapi.wxacode.getUnlimited({
    scene: scene,
    page: '/pages/detail/detail?id=' + event.postId + '&dbName=' + event.dbName
  })

  if (result.errCode === 0) {
    let upload = await cloud.uploadFile({
      cloudPath: event.postId + '.png',
      fileContent: result.buffer,
    })

    await db.collection("mini_posts").doc(event.postId).update({
      data: {
        qrCode: upload.fileID
      }
    });

    let fileList = [upload.fileID]
    let resultUrl = await cloud.getTempFileURL({
      fileList,
    })
    return resultUrl.fileList
  }

  return []

}

/**
 * 接入内容安全
 * @param {} event 
 */
async function checkPostComment(event) {

  try {
    let result = await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
    if (result.errCode == 0) {
      return true;
    }
    return false
  } catch (err) {
    return false;
  }
}
/**
 * 新增评论
 * @param {} event 
 */
async function addPostComment(event) {

  console.info("处理addPostComment")
  console.log(event)

  let task = db.collection('mini_posts').doc(event.commentContent.postId).update({
    data: {
      totalComments: _.inc(1)
    }
  });

  event.commentContent.flag = 0
  await db.collection("mini_comments").add({
    data: event.commentContent
  });

  let result = await task;

  //如果同意
  if (event.accept == 'accept') {
    await db.collection("mini_subcribute").add({
      data: {
        templateId: COMMENT_TEMPLATE_ID,
        openId: event.commentContent._openid,
        _createTime: new Date().getTime()
      }
    });
  }

}

/**
 * 新增子评论
 * @param {} event 
 */
async function addPostChildComment(event) {

  let task = db.collection('mini_posts').doc(event.postId).update({
    data: {
      totalComments: _.inc(1)
    }
  });

  event.comments[0].flag = 0

  await db.collection('mini_comments').doc(event.id).update({
    data: {
      childComment: _.push(event.comments)
    }
  })
  await task;

  //如果同意
  if (event.accept == 'accept') {
    await db.collection("mini_subcribute").add({
      data: {
        templateId: COMMENT_TEMPLATE_ID,
        openId: event.comments[0]._openid,
        _createTime: new Date().getTime()
      }
    });
  }

}

/**
 * 处理文章收藏
 * @param {*} event 
 */
async function addPostCollection(event) {
  console.info("处理addPostCollection方法开始")
  console.info(event)
  let postRelated = await db.collection('mini_posts_related').where({
    openId: event.openId == undefined ? event.userInfo.openId : event.openId,
    postId: event.postId,
    type: event.typeKind
  }).get();

  let task = db.collection('mini_posts').doc(event.postId).update({
    data: {
      totalCollection: _.inc(1)
    }
  });

  if (postRelated.data.length === 0) {
    let result = await db.collection('mini_posts_related').add({
      data: {
        openId: event.openId == undefined ? event.userInfo.openId : event.openId,
        postId: event.postId,
        postTitle: event.postTitle,
        postUrl: event.postUrl,
        postDigest: event.postDigest,
        type: event.typeKind,
        postClassify: event.postClassify,
        createTime: new Date().toFormat("YYYY-MM-DD")
      }
    })
    console.info(result)
  }

  let result = await task;
  console.info(result)
}

/**
 * 处理赞
 * @param {} event 
 */
async function addPostZan(event) {

  let postRelated = await db.collection('mini_posts_related').where({
    openId: event.openId == undefined ? event.userInfo.openId : event.openId,
    postId: event.postId,
    type: event.typeKind
  }).get();

  let task = db.collection('mini_posts').doc(event.postId).update({
    data: {
      totalZans: _.inc(1)
    }
  });

  if (postRelated.data.length === 0) {
    await db.collection('mini_posts_related').add({
      data: {
        openId: event.openId == undefined ? event.userInfo.openId : event.openId,
        postId: event.postId,
        postTitle: event.postTitle,
        postUrl: event.postUrl,
        postDigest: event.postDigest,
        type: event.typeKind,
        postClassify: event.postClassify,
        createTime: new Date().toFormat("YYYY-MM-DD")
      }
    });
  }
  let result = await task;
  console.info(result)
}

/**
 * 处理资源兑换
 * @param {} event 
 */
async function addResource(event) {

  let postRelated = await db.collection('mini_resource_related').where({
    openId: event.openId == undefined ? event.userInfo.openId : event.openId,
    resourceId: event.resourceId
  }).get();

  let task = db.collection('mini_resource').doc(event.resourceId).update({
    data: {
      download_num: _.inc(1)
    }
  });

  if (postRelated.data.length === 0) {
    await db.collection('mini_resource_related').add({
      data: {
        openId: event.openId == undefined ? event.userInfo.openId : event.openId,
        resourceId: event.resourceId,
        resourceTitle: event.resourceTitle,
        resourceBaidu: event.resourceBaidu,
        resourceUrl: event.resourceUrl,
        createTime: new Date().toFormat("YYYY-MM-DD")
      }
    });
  }
  let result = await task;
  console.info(result)
}

/**
 * 移除收藏/赞
 * @param {} event 
 */
async function deletePostCollectionOrZan(event) {
  //TODO:文章喜欢总数就不归还了？
  let result = await db.collection('mini_posts_related').where({
    openId: event.openId == undefined ? event.userInfo.openId : event.openId,
    postId: event.postId,
    type: event.typeKind
  }).remove()
  console.info(result)
}
/**
 * 获取文章明细
 * @param {} id 
 */
async function getPostsDetail(event) {
  console.log("event:", event)
  console.info("启动getPostsDetail")
  console.info(event)
  let post = await db.collection(event.dbName).doc(event.id).get()
  if (post.code) {
    return "";
  }
  if (!post.data) {
    return "";
  }
  let data = post.data

  const tasks = []
  //获取文章时直接浏览量+1
  let task = db.collection(event.dbName).doc(event.id).update({
    data: {
      totalVisits: _.inc(1)
    }
  })
  tasks.push(task)

  /*let task2 = db.collection('mini_member').doc(memberInfo._id).update({
    data: {
      totalPoints: _.inc(pointCount),
      modifyTime: new Date().getTime()
    }
  });
  tasks.push(task2)

  //积分明细
  let task3 = db.collection('mini_point_detail').add({
    data: {
      openId: event.info.openId,
      operateType: 0,//0:获得 1:使用 2:过期
      count: pointCount,
      desc: "浏览文章得积分",
      date: (new Date()).toFormat("YYYY-MM-DD HH24:MI:SS"),
      createTime: new Date().getTime()
    }
  })
  tasks.push(task3)*/

  if (event.typeKind != 1) {
    let content = await convertPosts(data.content, "html");
    data.content = content;
  }
  data.totalVisits = data.totalVisits + 1;
  await Promise.all(tasks)
  return data
}

/**
 * 转换下程序文章
 * @param {} isUpdate 
 */
async function convertPosts(content, type) {
  let res
  if (type === 'markdown') {
    res = await towxml.toJson(content || '', 'markdown');
  } else {
    res = await towxml.toJson(content || '', 'html');
  }
  return res;

}