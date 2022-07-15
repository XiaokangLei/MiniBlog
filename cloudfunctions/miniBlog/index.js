const initInfo = require('./initInfo/index');
const adminService = require('./adminService/index');
const memberService = require('./memberService/index');
const postsService = require('./postsService/index');

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.Env
})
const Towxml = require('towxml');
const db = cloud.database()
const _ = db.command
const dateUtils = require('date-utils')

const towxml = new Towxml();
const COMMENT_TEMPLATE_ID = '10XxRQC7TIOQTjdDWczTF8Bokgwkd9pkE0j7EiGW8eM'


// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event:", event)
  switch (event.type) {
    case 'initInfo':
      return await initInfo.main(event, context);
    case 'adminService':
      return await adminService.main(event, context);
    case 'memberService':
      return await memberService.main(event, context);
    case 'postsService':
      return await postsService.main(event, context);
  }
}