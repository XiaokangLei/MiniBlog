# 微信小程序个人博客

## 简介

微信小程序搜索【九月Online】查看小程序具体内容。

🪶MiniBlog是一款基于云开发的博客小程序，该小程序完全不依赖任何后端服务，无需自己的网站、服务器、域名等资源，只需要自行注册小程序账号即可；自带管理后端CMS，方便运营。

🌈源码全部开源，代码有详细注释。示例数据库文件在 `/database/` 文件夹内，支持自带CMS后台管理。

☘️部署简单，界面简洁，可使用 `ColourUI` 自定义界面，支持 `Markdown` 和 `HTML` 格式文章，方便排版，小程序端支持后台管理，会员、版本、广告位、评论、文章等方便管理。

🔥原生小程序性能更高，编译后大小不到700K，加载响应速度快。

🚀个人博客接入流量主、banner广告、激励广告、积分兑换等，多种方式变现。

## 功能

- [X] 文章列表、文章详情展示
- [X] 分享、点赞、收藏功能
- [X] 评论发布与展示
- [X] 海报小程序码生成功能
- [X] 专题、分类、标签功能
- [X] 签到、补签功能
- [X] 积分获取、兑换功能
- [X] 会员功能
- [X] 新版个人信息（头像、昵称）注册功能
- [X] 后台管理功能（会员管理、版本发布、广告位管理、显示管理、评论管理、文章管理、专题管理、类别管理、标签管理）

## 云数据库对应集合

```text
文章集合：mini_posts
评论内容集合：mini_comments
收藏点赞文章关联：mini_posts_related
博客相关配置集合：mini_config
博客相关操作日志：mini_logs
会员、用户信息表：mini_member
签到明细记录表：mini_sign_detail
积分明细记录表：mini_point_detail
订阅消息记录表：mini_subcribute
分享邀请记录表：mini_share_detail
积分商城资源表：mini_resource
积分兑换记录表：mini_resource_related
首页轮播图：mini_swiper
```

## 部署

- 1、下载源代码：`git clone https://github.com/XiaokangLei/MiniBlog.git`
- 2、微信开发者工具导入项目，选择自己的 `AppID`
- 3、选择自己的云开发环境，修改云函数 `miniBlog` 中所有的 `env` 环境，修改为自己的环境ID，右键 `miniBlog` 云函数，选择 `上传并部署：云端安装依赖`

  ```js
  cloud.init({
    env: 'xxxxxxxxxxx'
    })
  ```

- 4、修改云函数中的管理员openId，`/cloudfunctions/miniBlog/adminService/index.js`中

  ```js
  const authorOpenId = 'xxxxxxxxxxx'
  ```

- 5、创建 `/database/` 下的所有表，导入示例表数据，权限全部设置为 `所有用户可读，仅创建者可读写`
- 6、修改个人配置数据 `/miniprogram/utils/config.js` 中的

  ```js
  // 环境ID，修改为自己的环境ID
  var env = "xxxxxxxxxxx"
  // 云文件FileID前缀（修改个人头像会使用到）
  var fileIdPre = 'xxxxxxxxxxx'
  // 申请VIP一次性订阅消息TemplateId
  var vipApplyTemplateId = 'xxxxxxxxxxx'
  ```

## 页面展示

- 主要页面包括：首页最新、热门、标签页面，博客页面、评论、海报、收藏、点赞、分享、专题、个人中心页面

  ![04](https://pic3.zhimg.com/80/v2-73186e270ebea450b656191841f6979a_1440w.webp)

- 修改个人身份、日历签到、积分、积分兑换页面、VIP申请、历史版本、关于、后台管理页面

  ![05](https://pic4.zhimg.com/80/v2-0cffaa4c7357fdd92425942024402d73_1440w.webp)

- 管理后台CMS

  ![06](https://pic3.zhimg.com/80/v2-a6f61d5d420279102232fdaeef991f0a_1440w.webp)

## 感谢

- UI组件库：[Colour-UI 2.0](https://github.com/weilanwl/ColorUI/)
- Markdown插件：[Towxml 2.0](https://github.com/sbfkcel/towxml)
- 日历插件：[wx_calendar 小历同学](https://treadpit.github.io/wx_calendar/)

## 联系我

- 邮箱📧：lxk201808@163.com
- QQ群🐧：465737893

## 支持

![05](https://pic3.zhimg.com/80/v2-a1225a9a1ea9b01aeb77ca915811fb5e_1440w.webp)
