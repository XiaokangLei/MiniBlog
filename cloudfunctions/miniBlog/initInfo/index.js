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
    defaultUrl = 'https://6669-final-6gypsolb231307a9-1304273986.tcb.qcloud.la/avatar/'
    allAvatar = ['0001.jpg', '0002.jpg', '0003.jpg', '0004.jpg', '0005.jpg', '0006.jpg', '0007.jpg', '0008.jpg', '0009.jpg', '0010.jpg', '0011.jpg', '0012.jpg', '0013.jpg', '0014.jpg', '0015.jpg', '0016.jpg', '0017.jpg', '0018.jpg', '0019.jpg', '0020.jpg','0021.jpg', '0022.jpg', '0023.jpg', '0024.jpg', '0025.jpg', '0026.jpg', '0027.jpg', '0028.jpg', '0029.jpg', '0030.jpg', '0031.jpg', '0032.jpg', '0033.jpg', '0034.jpg', '0035.jpg', '0036.jpg', '0037.jpg', '0038.jpg', '0039.jpg', '0040.jpg','0041.jpg', '0042.jpg', '0043.jpg', '0044.jpg', '0045.jpg', '0046.jpg', '0047.jpg', '0048.jpg', '0049.jpg', '0050.jpg', '0051.jpg', '0052.jpg', '0053.jpg', '0054.jpg', '0055.jpg', '0056.jpg', '0057.jpg', '0058.jpg', '0059.jpg', '0060.jpg','0061.jpg', '0062.jpg', '0063.jpg', '0064.jpg', '0065.jpg', '0066.jpg', '0067.jpg', '0068.jpg', '0069.jpg', '0070.jpg','0071.jpg', '0072.jpg', '0073.jpg', '0074.jpg', '0075.jpg', '0076.jpg', '0077.jpg', '0078.jpg', '0079.jpg', '0080.jpg','0081.jpg', '0082.jpg', '0083.jpg', '0084.jpg', '0085.jpg', '0086.jpg', '0087.jpg', '0088.jpg', '0089.jpg', '0090.jpg','0091.jpg', '0092.jpg', '0093.jpg', '0094.jpg', '0095.jpg', '0096.jpg', '0097.jpg', '0098.jpg', '0099.jpg', '0100.jpg',]
    var randomName = defaultUrl + allAvatar[Math.floor(Math.random() * 100) + 1]
    avatarUrl = randomName
    nickName = "匿名" + (Date.now()).toString().substring(3, 11);
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