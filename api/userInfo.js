/**
 *@des 个人中心相关接口
 *@author hjp1011 21931118@qq.com
 *@blog http://www.wephp.com
 *@date 2019/11/16 11:04:16
 */
// 个人信息
const memberInfo = '/we-office/v1/member/member/index';
// 个人信息修改
const memberUpdate = '/we-office/v1/member/member/update';
// 机构信息
const merchantInfo = '/we-office/v1/merchant/merchant/index';

// 意见反馈列表
const opinionList = '/we-office/v1/member/opinion/index';
// 意见反馈创建
const opinionCreate = '/we-office/v1/member/opinion';
// 意见反馈详情
const opinionDetail = '/we-office/v1/member/opinion/view';

// 第三方授权列表
const thirdPartyAuthList = '/we-office/v1/member/auth/index';
// 解除第三方授权列表
const thirdPartyAuthDelete = '/we-office/v1/member/auth/delete';

// 上传图片
const uploadImage = '/we-office/v1/common/file/images';

// 待办工作
const worksList = '/we-office/v1/member/works/index';
const worksDetail = '/we-office/v1/member/works';

// 消息列表
const notifyIndex = '/we-office/v1/notify/announce/index';
// 消息详情
const notifyView = '/we-office/v1/member/notify/view';
// 单个消息阅读
const notifyRead = '/we-office/v1/notify/announce/read';
// 全部已读
const notifyReadAll = '/we-office/v1/member/notify/read-all';
// 删除一条或者多条
const notifyClear = '/we-office/v1/member/notify/clear';
// 清空消息记录
const notifyClearAll = '/we-office/v1/member/notify/clear-all';
// 未读消息个数
const notifyUnRreadCount = '/we-office/v1/member/notify/un-read-count';
// 消息提醒配置
const notifySubscriptionConfigIndex =
	'/we-office/v1/member/notify-subscription-config/index';
// 修改消息提醒配置
const notifySubscriptionConfigUpConfig =
	'/we-office/v1/member/notify-subscription-config/up-config';

// 会员等级
const memberLevelIndex = '/we-office/v1/member/member-level/index';

export {
	memberInfo,
	memberUpdate,


	uploadImage,
	opinionList,
	opinionCreate,
	opinionDetail,
	thirdPartyAuthList,
	thirdPartyAuthDelete,

	notifyIndex,
	notifyView,
	notifyRead,
	notifyReadAll,
	notifyClear,
	notifyClearAll,
	notifyUnRreadCount,
	notifySubscriptionConfigUpConfig,
	notifySubscriptionConfigIndex,

	memberLevelIndex,
	worksList,
	worksDetail,
	merchantInfo
};
