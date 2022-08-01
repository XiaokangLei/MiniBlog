/**
 * 打赏二维码
 */
var moneyUrl = "https://7465-test-we0f3-1301386292.tcb.qcloud.la/zanshang.jpg"

var fileIdPre = 'cloud://test-we0f3.7465-test-we0f3-1301386292/'

/**
 * 云开发环境
 */
var env = "test-we0f3"
// var env = "final-6gypsolb231307a9"

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

// var subcributeTemplateId="10XxRQC7TIOQTjdDWczTF8Bokgwkd9pkE0j7EiGW8eM"
var vipApplyTemplateId = 'mCInmCCR_RzdMDNvBN2ranJaTKX74-4BqP9w_R0IRKg'

module.exports = {
  postRelatedType: postRelatedType,
  moneyUrl: moneyUrl,
  env: env,
  fileIdPre: fileIdPre,
  vipApplyTemplateId: vipApplyTemplateId
}