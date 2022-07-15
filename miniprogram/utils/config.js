/**
 * 打赏二维码
 */
var moneyUrl = "https://6669-final-6gypsolb231307a9-1304273986.tcb.qcloud.la/zanshang.jpg?sign=683673790bae0750dff80e2a2ffa5170&t=1656776035"

/**
 * 公众号二维码
 */
var wechatUrl = "https://6669-final-6gypsolb231307a9-1304273986.tcb.qcloud.la/zanshang.jpg?sign=683673790bae0750dff80e2a2ffa5170&t=1656776035"

/**
 * 云开发环境
 */
// var env ="test-we0f3"
var env = "final-6gypsolb231307a9"

/**
 * 个人文章操作枚举
 */
var postRelatedType = {
  COLLECTION: 1,
  ZAN: 2,
  properties: {
    1: {
      desc: "收藏"
    },
    2: {
      desc: "点赞"
    }
  }
};

// 评论审核通知模板
// var subcributeTemplateId="10XxRQC7TIOQTjdDWczTF8Bokgwkd9pkE0j7EiGW8eM"

module.exports = {
  postRelatedType: postRelatedType,
  moneyUrl: moneyUrl,
  wechatUrl: wechatUrl,
  env: env,
}