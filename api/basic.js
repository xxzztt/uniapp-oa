/**
 *@des 公用基础
 *@author hjp1011 21931118@qq.com
 *@blog http://www.wephp.com
 *@date 2019/11/19 14:56:57
 *@param registerByPass
 */

// 获取省市区列表
const provinceList = '/we-office/v1/common/provinces/index';
// 收藏商品
const collectCreate = '/we-office/v1/common/collect/create';
// 删除收藏商品
const collectDel = '/we-office/v1/common/collect/delete';
// 分享/转发
const transmitCreate = '/we-office/v1/common/transmit/create';

// 广告
const advList = '/we-office/v1/article/adv/index';
const advView = '/we-office/v1/common/adv/view';

// 配置
const configList = '/we-office/v1/common/config/index';

// 充值
const payCreate = '/we-office/v1/common/pay/create';

// 充值配置
const wechatConfig = '/we-office/v1/third-party/wechat-js-sdk';

// 公告
// 公告列表
const notifyAnnounceIndex = '/we-office/v1/common/notify-announce/index';
// 公告详情
// const notifyAnnounceView = '/we-office/v1/notify/announce/view';
const notifyAnnounce = '/we-office/v1/notify/announce';

// 版本检测
const versionsIndex = '/app-versions/versions/index';

// 版本检测
const pickupPointIndex = '/we-office/v1/common/pickup-point/index';

// 站点帮助-列表
const helperIndex = '/we-office/v1/common/helper/index';
// 站点帮助-详情
const helperView = '/we-office/v1/common/helper/view';

// 设备绑定(app推送)
const bindingEquipment = '/we-office/v1/member/auth/binding-equipment';
// 查询绑定状态
const authIsBinding = '/we-office/v1/member/auth/is-binding';
// 第三方绑定
const authCreate = '/we-office/v1/member/auth/create';

//学习中心
const studyList = '/we-office/v1/article/article/index';
const studyDetail = '/we-office/v1/article/article';
const articleCate = '/we-office/v1/article/article/cate';
//工作流状态
const workState = '/we-office/v1/cate/work-state';
//报修
const repair = '/we-office/v1/works/repair';
const repairMsg = '/we-office/v1/cate/repair-msg';
const repairType = '/we-office/v1/cate/repair-type';
const getRepairType = '/we-office/v1/cate/get-repair-type';
//申领-申购
const get = '/we-office/v1/works/get';
const getMsg = '/we-office/v1/cate/get-msg';
const shop = '/we-office/v1/works/shop';
const shopMsg = '/we-office/v1/cate/shop-msg';
//资产
const asset = '/we-office/v1/works/asset';
const assetType = '/we-office/v1/cate/asset-type';
const getAssetType = '/we-office/v1/cate/get-asset-type';
//用车
const car = '/we-office/v1/works/car';
const carState = '/we-office/v1/cate/car-state';
const carType = '/we-office/v1/cate/car-type';
const getCarType = '/we-office/v1/cate/get-car-type';
const carApply = '/we-office/v1/works/car-apply';
//加班
const overtime = '/we-office/v1/works/overtime';
const overtimeType = '/we-office/v1/cate/overtime-type';
const getOvertimeType = '/we-office/v1/cate/get-overtime-type';
//出差
const trip = '/we-office/v1/works/trip';
//请假
const holiday = '/we-office/v1/works/holiday';
const holidayType = '/we-office/v1/cate/holiday-type';
const getHolidayType = '/we-office/v1/cate/get-holiday-type';
//报销
const expense = '/we-office/v1/works/expense';
const expenseType = '/we-office/v1/cate/expense-type';
const getExpenseType = '/we-office/v1/cate/get-expense-type';
//巡更
const patrolPlan = '/we-office/v1/patrol/plan';
const record = '/we-office/v1/patrol/record';
const place = '/we-office/v1/patrol/record/place';
const planState = '/we-office/v1/cate/plan-state';
const placeState = '/we-office/v1/cate/place-state';
const getClasses = '/we-office/v1/cate/get-classes';
//考勤
const attendPlan = '/we-office/v1/attend/plan';
const check = '/we-office/v1/attend/check';
const attendCheckState = '/we-office/v1/cate/attend-check-state';
const attendPlanState = '/we-office/v1/cate/attend-plan-state';
const attendCheckType = '/we-office/v1/cate/attend-check-type';
const getAttendClasses = '/we-office/v1/cate/get-attend-classes';
//通讯录
const contact = '/we-office/v1/member/contact';
//就餐
const dining = '/we-office/v1/logistics/dining';
const diningType = '/we-office/v1/cate/dining-type';
//采购
const purchase = '/we-office/v1/logistics/purchase';
const purchaseType = '/we-office/v1/cate/purchase-type';
const getPurchaseType = '/we-office/v1/cate/get-purchase-type';

//档案
const archives = '/we-office/v1/personnel/archives';
const archivesType = '/we-office/v1/cate/archives-type';
const getArchivesType = '/we-office/v1/cate/get-archives-type';
//员工
const employees = '/we-office/v1/personnel/employees';
const getEmployees = '/we-office/v1/cate/get-employees';
//合同
const contract = '/we-office/v1/personnel/contract';
//奖惩
const rewards = '/we-office/v1/personnel/rewards';
const rewardsType = '/we-office/v1/cate/rewards-type';
const getRewardsType = '/we-office/v1/cate/get-rewards-type';
//社保
const insurance = '/we-office/v1/personnel/insurance';
//日志
const log = '/we-office/v1/mycenter/log';
const logType = '/we-office/v1/cate/log-type';
const getLogType = '/we-office/v1/cate/get-log-type';
//日志
const summary = '/we-office/v1/mycenter/summary';
const summaryType = '/we-office/v1/cate/summary-type';
const getSummaryType = '/we-office/v1/cate/get-summary-type';
//日程
const calendar = '/we-office/v1/mycenter/calendar';
const calendarType = '/we-office/v1/cate/calendar-type';
const getCalendarType = '/we-office/v1/cate/get-calendar-type';
//政治面貌
const politicalType = '/we-office/v1/cate/political-type';
//合同类型
const contractType = '/we-office/v1/cate/contract-type';
const getContractType = '/we-office/v1/cate/get-contract-type';

export {

	archives,
	archivesType,
	getArchivesType,
	employees,
	getEmployees,
	contract,
	rewards,
	rewardsType,
	getRewardsType,
	insurance,
	log,
	logType,
	getLogType,
	summary,
	summaryType,
	getSummaryType,
	calendar,
	calendarType,
	getCalendarType,
	politicalType,
	contractType,
	getContractType,


	provinceList,
	collectCreate,
	collectDel,
	transmitCreate,
	advList,
	advView,
	payCreate,
	configList,
	wechatConfig,
	notifyAnnounce,
	notifyAnnounceIndex,
	// notifyAnnounceView,
	versionsIndex,
	pickupPointIndex,
	helperIndex,
	helperView,
	bindingEquipment,
	authIsBinding,
	authCreate,

	studyList,
	studyDetail,
	articleCate,
	workState,
	repair,
	repairMsg,
	repairType,
	getRepairType,
	get,
	getMsg,
	shop,
	shopMsg,
	asset,
	assetType,
	getAssetType,
	car,
	carState,
	carApply,
	carType,
	getCarType,
	overtime,
	overtimeType,
	getOvertimeType,
	trip,
	holiday,
	holidayType,
	getHolidayType,
	expense,
	expenseType,
	getExpenseType,
	patrolPlan,
	record,
	place,
	planState,
	placeState,
	getClasses,
	attendPlan,
	check,
	attendCheckState,
	attendPlanState,
	attendCheckType,
	getAttendClasses,
	contact,
	dining,
	diningType,
	purchase,
	purchaseType,
	getPurchaseType,
};
