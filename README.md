#简介
UNI办公系统主要为国内企业提供办公自动化信息服务，功能如：工作流、工作审批（报修申请、报销申请、领用申请、申购申请、请假申请、出差申请、加班申请、用工申请、接待申请、用车申请）；个人中心(公告管理、消息管理、工作日志、我的日程、工作总结)；知识管理(新闻动态、管理制度、下载中心等)；日常管理(资产管理、车辆管理、档案管理、考勤管理、巡更巡检、合同管理、后勤采购、就餐统计、通讯录)；人事管理(员工信息、奖惩管理、社保管理等)、考勤管理(班次管理、排班管理、我的排班、签到签退)；巡更巡检(地点管理、巡更班次、巡更计划、我的排班、巡更记录)；意见反馈、站点帮助、在线客服、一键换肤等功能模块。

系统前端基于uniapp开发，后端基于php开发；该系统可独立部署在自己的服务器，且支持单企业版和多企业版本；可后台根据用户角色权限控制手机端功能模块的显示；目前已适配H5、微信小程序、安卓和ios，如果在试用或购买后发现问题，欢迎您随时提出。

#咨询

作者QQ：21931118 QQ群：1107210028
如您已下载本插件，可加入QQ群一起讨论，作者不承诺技术支持；

#演示

1. 后台演示账号：后台不开源，不免费提供后台账号及接口
2. 手机端演示账号：18986869999/18986869999
3. 业务合作：加Q私聊
![](http://wephp-oa.oss-cn-shenzhen.aliyuncs.com/images/2020/11/23/image_1606146357_mz3LWWi7.png)

#后台部分截图

# 安装插件
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/212543_7cbf5a2b_526830.png "屏幕截图.png")
# 已安装插件
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/212625_072d9ed1_526830.png "屏幕截图.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/211837_c27040c4_526830.png "屏幕截图.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/212019_017bc422_526830.png "屏幕截图.png")
# 工作流列表
![](https://images.gitee.com/uploads/images/2021/0226/213507_0bae368a_526830.png "屏幕截图.png")
# 工作流配置
## 流程状态
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/213551_9056a989_526830.png "屏幕截图.png")
## 配置审核人员
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/213714_1cdaa09a_526830.png "屏幕截图.png")
```
支持指定人员审核和指定角色审核
```
## 工作流转
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/213811_ff518d71_526830.png "屏幕截图.png")
## 新增流程节点
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/214041_6f5cfcbe_526830.png "屏幕截图.png")
# 待办工作
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/214708_aa6c0eb9_526830.png "屏幕截图.png")
# 已办工作
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/214850_8811d3c3_526830.png "屏幕截图.png")

```
如果审核失误，在下一级没有审核的情况下，可点击重审按钮进行重新审核，流程将重新转入申请状态。
```

# 审核工作
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/214803_bf66ca36_526830.png "屏幕截图.png")

# 创建申请
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/215045_b3f0a825_526830.png "屏幕截图.png")
# 查看进度
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/215111_daa20762_526830.png "屏幕截图.png")

```
如果工作已有人员进行审核，进入工作流转后，用户不能编辑和删除该工作。
```
# 分类列表
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/215241_0ddfdf98_526830.png "屏幕截图.png")

```
企业管理人员可自定义工作类型
```
# 创建分类
![输入图片说明](https://images.gitee.com/uploads/images/2021/0226/215327_b6d68790_526830.png "屏幕截图.png")


#开始使用

1. 将项目导入HBuildX
2. 修改配置文件config/index.conf.js内配置对应参数
3. 运行即可体验

#发行微信小程序

在HBuildx顶部菜单点击运行->运行到微信小程序
使用微信开发者工具上传版本并审核通过即可
>注意：小程序需额外配置服务器域名

#发行H5

在HBuildx顶部菜单点击发行->网站-H5手机版
在弹出的对话框中输入网站标题和域名即可，将编译后的资源部署到服务器（虚拟主机）
>需注意HBx直接部署网页托管需要最新版，老版本没有这个选项，可以自己到web控制台进行托管。
点击发行，等待项目编译部署即可。
如果您不想购买服务器，那就来uniCloud白嫖一波吧~

#发行ios版和安卓版
在HBuildx顶部菜单点击发行->原生App-云打包，
在弹出的对话框中选择证书文件和输入密码即可。

#隐私、权限声明

- 本插件需要申请的系统权限列表：

	1.定位权限 2.拍照权限 3.相册权限

- 本插件采集的数据、发送的服务器地址、以及数据用途说明：

	无

- 本插件是否包含广告，如包含需详细说明广告表达方式、展示频率：

	无

#致谢

>感谢开发过程中小明和简言对我的技术支持；感谢以下的项目，排名不分先后

Vuejs： https://github.com/vuejs/vue

uni-app： https://uniapp.dcloud.io/

mix-mall: https://ext.dcloud.net.cn/plugin?id=200

ColorUI: https://github.com/weilanwl/ColorUI

TinyShop-UniApp:https://github.com/stavyan/TinyShop-UniApp
