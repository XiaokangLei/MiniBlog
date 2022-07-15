const cloud = require('wx-server-sdk');

cloud.init({
  env: 'final-6gypsolb231307a9'
});

const db = cloud.database()

/**
 * 获取用户openid，并注册用户信息
 * event 参数包含小程序端调用传入的 data
 */
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  // 查找用户是否存在
  const result = await db
    .collection('mini_member')
    .where({
      _openid: openId
    })
    .get()
  // admin功能
  const resultAdmin = await db
    .collection('mini_config')
    .where({
      key: "admin"
    })
    .get()

  const idData = result.data[0]
  const idDataAdmin = resultAdmin.data[0]
  var avatarUrl = ""
  var nickName = ""
  var admin = false
  if (result.data.length < 1) {
    avatarUrl = "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
    nickName = "微信用户"
    let date = new Date().toLocaleDateString().split('/').join('-');
    await db.collection('mini_member').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _openid: openId,
        totalSignedCount: 0, //累计签到数
        continueSignedCount: 0, //持续签到
        totalPoints: 0, //积分
        lastSignedDate: date, //最后一次签到日期
        level: 1, //会员等级（预留）
        unreadMessgeCount: 0, //未读消息（预留）
        modifyTime: new Date().getTime(),
        avatarUrl: avatarUrl, //头像
        nickName: nickName, //昵称
        applyStatus: 0 //申请状态 0:默认 1:申请中 2:申请通过 3:申请驳回
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  } else {
    avatarUrl = idData.avatarUrl
    nickName = idData.nickName
  }
  admin = idDataAdmin.isShow
  return {
    event,
    userId: idData && idData._id && idData._openid ? idData._id : null,
    openId: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    avatarUrl: avatarUrl,
    nickName: nickName,
    admin: admin
  }
}