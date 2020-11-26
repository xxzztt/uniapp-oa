/**
 *@des 登录注册相关接口
 *@author hjp1011 21931118@qq.com
 *@blog http://www.wephp.com
 *@date 2019/11/15 15:14:47
 *@param login.js
 */

// 密码注册
const registerByPass = '/we-office/v1/site/register';

// 密码登录
const loginByPass = '/we-office/v1/site/login';

// 微信授权登录
const wechatH5Login = '/we-office/v1/third-party/wechat';

// 微信小程序授权登录
const mpWechatLogin = '/we-office/v1/third-party/wechat-mp';

// App微信授权登录
const thirdPartyWechatOpenPlatform = '/we-office/v1/third-party/wechat-open-platform';

// Ios苹果扥估
const thirdPartyApple = '/we-office/v1/third-party/apple';

// 密码重置
const updatePassword = '/we-office/v1/site/up-pwd';

// 第三方绑定
const authLogin = '/we-office/v1/member/auth/create';

// 查询绑定状态
const isBindingCheck = '/we-office/v1/member/auth/is-binding';

// 手机号登录
const loginBySmsCode = '/we-office/v1/site/mobile-login';

// 获取手机验证码
const smsCode = '/we-office/v1/site/sms-code';

// 退出登录
const logout = '/we-office/v1/site/logout';

// 刷新token
const refreshToken = '/we-office/v1/site/refresh';

// 登录令牌有效性检测
const verifyAccessToken = '/we-office/v1/site/verify-access-token';

export {
	registerByPass,
	loginByPass,
	isBindingCheck,
	wechatH5Login,
	mpWechatLogin,
	thirdPartyWechatOpenPlatform,
	thirdPartyApple,
	authLogin,
	updatePassword,
	smsCode,
	loginBySmsCode,
	logout,
	refreshToken,
	verifyAccessToken
};
