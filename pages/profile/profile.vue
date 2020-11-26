<template>
	<view class="user">
		<!--头部-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>
			<!--用户信息-->
			<view class="user-info-box">
				<view class="portrait-box" @tap="navTo(userInfo ? '/pages/user/userinfo/userinfo' : 'login')">
					<image class="portrait" :src="userInfo.head_portrait || headImg"></image>
					<text class="username">
						{{ userInfo.realname ||'登录/注册'}} {{ userInfo.department&&userInfo.department.title || ''}}
					{{ userInfo.mobile || '没有填写手机号'}}
					</text>
				</view>
			</view>
			<!--vip信息-->
			<view class="vip-card-box">
				<view class="b-btn">
					{{userInfo.role&&userInfo.role.title || '系统管理员'}}
				</view>
				<view class="tit">
					<i class="iconfont iconzuanshi" />
					{{ userInfo.merchant&&userInfo.merchant.company_name || '未知' }}
				</view>
				<text class="e-m">技术支持:QQ:21931118 Mail:21931118@qq.com</text>
			</view>
		</view>
		<!-- 个人中心 内容区-->

		<view  class="cover-container" :style="[
			{
				transform: coverTransform,
				transition: coverTransition
			}
		]"
		 @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">
			<image class="arc" :src="arc"></image>
			<!--个人中心-->
			<view class="promotion-center">
				<list-cell
					icon="iconicon1"
					:iconColor="themeColor.color"
					navigateType=""
					title="个人中心"
				></list-cell>
				<view class="order-section">
					<view
						class="order-item"
						v-for="item in mycenterList"
						:key="item.title"
						@tap="navTo(item.url)"
						hover-class="common-hover"
						:hover-stay-time="50"
					>
						<i class="iconfont" :class="[item.icon, 'text-'+themeColor.name]" />
						<text>{{ item.title }}</text>

					</view>
				</view>
			</view>
			<!-- 个人资料 -->
			<view  class="set">
				<view class="list-cell b-b" :class="{ 'm-t': item.class === 'mT' }" v-for="item in setList" :key="item.title" @tap="navTo(item.url)"
				 hover-class="cell-hover" :hover-stay-time="50">
					<text class="cell-tit">{{ item.title }}</text>
					<text class="cell-tip">{{ item.content }}</text>
					<text class="cell-more iconfont iconyou"></text>
				</view>

			</view>

			<view class="cu-list menu sm-border card-menu" v-if="styleUserIsOpen">
				<view class="cu-item">
					<view class="content flex align-center">
						<text class="cuIcon-colorlens" :class="'text-' + themeColor.name"></text>
						<view class="padding solid radius shadow-blur" :class="'bg-' + themeColor.name"></view>
						<view class="title">主题色：<text :class="'text-' + themeColor.name">{{
							themeColor.title
						}}</text></view>
					</view>
					<view class="action">
						<button class="cu-btn round shadow" @click="showColorModal" :class="'bg-' + themeColor.name">
							<text class="cuIcon-colorlens"></text> 选择主题
						</button>
					</view>
				</view>
			</view>
			<view v-if="hasLogin" class="list-cell log-out-btn" :class="'text-' + themeColor.name" @tap="toLogout">
				<text class="cell-tit">退出登录</text>
			</view>
		<!--版本更新-->
		<!-- #ifdef APP-PLUS -->
		<oa-version-upgrade
			isTipsShow
			@tip="handleTip"
			@close="handleVersionUpgradeShow"
			:isShow="isVersionUpgradeShow"
		></oa-version-upgrade>
		<!-- #endif -->
		<!-- 选择颜色模态框 -->
		<view class="cu-modal" :class="{ show: colorModal }">
			<view class="cu-dialog">
				<view class="cu-bar justify-end solid-bottom">
					<view class="content">选择颜色</view>
					<view class="action" @tap="colorModal = false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="grid col-5 padding">
					<view
						class="padding-xs"
						v-for="(item, index) in themeList"
						:key="index"
						@tap="SetColor(item)"
						:data-color="item.name"
					>
						<view class="padding-tb radius" :class="'bg-' + item.name">
							{{ item.title }}
						</view>
					</view>
					</view>
				</view>
			</view>


		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
	/**
	 * @des 个人中心
	 *
	 * @author hjp1011 21931118@qq.com
	 * @date 2020-01-10 11:41
	 * @copyright 2019
	 */
	import {
		memberInfo
	} from '@/api/userInfo';
	import {
		mapMutations
	} from 'vuex';
	import $mAssetsPath from '@/config/assets.config';
	import listCell from '@/components/oa-list-cell';
	import { logout } from '@/api/login';
	import rfVersionUpgrade from '@/components/oa-version-upgrade';
	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			listCell,rfVersionUpgrade
		},
		data() {
			return {
				isNewVersion: false,
				colorModal: false,
				mycenterList: this.$mConstDataConfig.mycenterList,
				themeList: this.$mConstDataConfig.themeList,
				isVersionUpgradeShow: false,
				loadProgress: 0,
				styleUserIsOpen: this.$mSettingConfig.styleUserIsOpen,
				setList: this.$mConstDataConfig.setList,
				headImg: this.$mAssetsPath.headImg,
				userBg: this.$mAssetsPath.userBg,
				vipCardBg: this.$mAssetsPath.vipCardBg,
				arc: this.$mAssetsPath.arc,
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				user_integral: 0,
				userInfo: {
					realname:'',
					mobile:'',
					merchant:null,
					department:null,
					role:null,
				},
				user: {},
				loading: true,
				appName: this.$mSettingConfig.appName,
				hasLogin: false
			};
		},
		async onShow() {
			// 初始化数据
			await this.initData();
			// console.log(this.user);
		},
		onLoad() {
			// this.initData();
			// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform === 'ios') {
				this.CustomBar = 0;
			}
			// #endif
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
			}
		},
		// #endif
		methods: {
			// ...mapMutations(['setNotifyNum']),
			handleTip(isNewVersion) {
				this.isNewVersion = isNewVersion;
			},
			handleVersionUpgradeShow() {
				this.isVersionUpgradeShow = false;
			},
			...mapMutations(['login']),
			// 数据初始化
			async initData() {
				this.user = uni.getStorageSync('user');
				// console.log(this.user);
				// 缓存大小
				this.setList[2].content = `${uni.getStorageInfoSync().currentSize} kb`;
				// #ifdef APP-PLUS
				// eslint-disable-next-line
				this.setList[5].content = `当前版本 ${plus.runtime.version}`;
				// this.getNotifySubscriptionConfigIndex();
				// #endif
				this.hasLogin = this.$mStore.getters.hasLogin;
				uni.setTabBarStyle({
					selectedColor: this.themeColor.color,
					borderStyle: 'white'
				});
				uni.setNavigationBarColor({
				    frontColor: '#ffffff',
				    backgroundColor: this.themeColor.color,
				    animation: {
				        duration: 400,
				        timingFunc: 'easeIn'
				    }
				});
				this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
					uni.setTabBarItem({
						index,
						selectedIconPath
					});
				});
				if (this.hasLogin) {
					// console.log(this.hasLogin);
					await this.getMemberInfo();
				} else {
					this.loading = false;
					// this.resetSectionData();
				}
			},
			// 退出登录
			toLogout() {
				uni.showModal({
					content: '确定要退出登录么',
					success: e => {
						if (e.confirm) {
							this.$http.post(`${logout}`).then(() => {
								this.$mStore.commit('logout');
								uni.reLaunch({
									url: '/pages/profile/profile'
								});
							});
						}
					}
				});
			},
			showColorModal() {
				this.colorModal = true;
			},
			SetColor(item) {
				this.colorModal = false;
				this.themeColor = item;
				this.$mStore.commit('setThemeColor', item);
				uni.setNavigationBarColor({
				    frontColor: '#ffffff',
				    backgroundColor: this.themeColor.color,
				    animation: {
				        duration: 400,
				        timingFunc: 'easeIn'
				    }
				});
				uni.setTabBarStyle({
					selectedColor: this.themeColor.color,
					borderStyle: 'white'
				});
				this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
					uni.setTabBarItem({
						index,
						selectedIconPath
					});
				});
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.get(memberInfo)
					.then(async r => {
						// console.log(r.data);
						this.loading = false;
						this.userInfo = r.data;
						// console.log(this.userInfo);
						// await this.setSectionData(r.data);
						// this.user_level = r.data.role.title;
						// this.merchant = r.data.merchant;
						// this.department = r.data.department;
						// 更新userInfo缓存
						uni.setStorageSync('userInfo', r.data);
					})
					.catch(() => {
						this.hasLogin = false;
						this.userInfo = {};
						// this.resetSectionData();
						this.loading = false;
					});
			},

			// 给个人中心的各模块赋值
			setSectionData(data) {
				this.user_level = data.role.title;
				this.merchant = data.merchant;
				this.department = data.department;
				// 更新userInfo缓存
				uni.setStorageSync('userInfo', data);
			},

			// 统一跳转接口,拦截未登录路由
			navTo(route) {
				if (!route) return;
				if (!this.hasLogin) {
					uni.removeStorageSync('backToPage');
					this.$mRouter.push({
						route: '/pages/public/login'
					});
				} else {
					if (route === 'clearCache') {
						uni.showModal({
							content: '确定要清除缓存吗',
							success: e => {
								if (e.confirm) {
									uni.clearStorageSync();
									this.setList[2].content = '0 kb';
									this.$mStore.commit('login', this.user);
									this.$mHelper.toast('清除缓存成功');
								}
							}
						});
						return;
					} else if (route === 'versionUpgrade') {
						this.isVersionUpgradeShow = true;
						if (this.isNewVersion) {
							this.$mHelper.toast('已经是最新版本');
						}
						return;
					}
					this.$mRouter.push({
						route
					});
				}
			},
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}
				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			},


		}
	};
</script>
<style lang="scss" scoped>
	page {
		background-color: $page-color-base;
	}

	.user {
		.promotion-center {
			background: #fff;
			margin-bottom: 20upx;
			/*分类列表*/
			.category-list {
				width: 100%;
				padding: 0 0 30upx 0;
				border-bottom: solid 2upx #f6f6f6;
				display: flex;
				flex-wrap: wrap;
				.category {
					width: 33.3%;
					margin-top: 50upx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.img {
						width: 100%;
						display: flex;
						justify-content: center;

						.iconfont {
							font-size: $font-lg + 24upx;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24upx;
						color: #3c3c3c;
					}
					.share-btn {
						height: 142upx;
						text-align: left;
						background: none;
						padding: 0;
						margin: 0;
					}

					.share-btn:after {
						border: none;
						border-radius: none;
					}
				}
			}
		}
		.order-section {
			@extend %section;
			padding: 28upx 0;
			.order-item {
				@extend %flex-center;
				width: 120upx;
				height: 120upx;
				border-radius: 10upx;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
			}

			.badge {
				position: absolute;
				top: 0;
				right: 4upx;
			}

			.iconfont {
				font-size: 48upx;
			}

			.icon-shouhoutuikuan {
				font-size: 44upx;
			}
		}
		.no-foot-print {
			text-align: center;
			padding: 48upx 0;

			.no-foot-print-icon {
				font-size: $font-lg + 2upx;
				margin-right: 10upx;
			}
		}
		.set {
			padding: $spacing-base 0;

		}
		.cu-list.card-menu {
			margin: $spacing-base 0;
			.title {
				margin-left: $spacing-base;
			}
		}
		.user-section {
			height: 520upx;
			padding: 100upx 30upx 0;
			position: relative;

			.bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: 60vw;
				opacity: 0.84;
			}

			.user-info-box {
				height: 180upx;
				display: flex;
				align-items: center;
				position: relative;
				z-index: 1;
				justify-content: space-between;

				.portrait-box {
					display: flex;
					align-items: center;

					.portrait {
						width: 130upx;
						height: 130upx;
						border: 5upx solid #fff;
						border-radius: 50%;
					}

					.username {
						font-size: $font-lg + 6upx;
						color: $color-white;
						margin-left: 20upx;
					}

					button {
						background-color: transparent;
						font-size: $font-lg + 6upx;
						color: $font-color-dark;
						border: none;
					}

					button::after {
						border: none;
					}
				}
			}

			.vip-card-box {
				display: flex;
				flex-direction: column;
				color: #f7d680;
				height: 240upx;
				background: url('/static/vip-card.png');
				background-size: 100% 100%;
				border-radius: 16upx 16upx 0 0;
				overflow: hidden;
				position: relative;
				padding: 20upx 24upx;

				.b-btn {
					position: absolute;
					right: 24upx;
					top: 24upx;
					width: 160upx;
					height: 40upx;
					text-align: center;
					line-height: 40upx;
					font-size: 22upx;
					color: #36343c;
					border-radius: 20px;
					background: linear-gradient(to left, #f9e6af, #ffd465);
					z-index: 1;
				}

				.tit {
					font-size: $font-base + 2upx;
					color: #f7d680;
					margin-bottom: 28upx;

					.iconfont {
						color: #f6e5a3;
						display: inline-block;
						margin-right: 16upx;
					}
				}
			}
		}

		.cover-container {
			margin-top: -150upx;
			padding: 0 30upx 20upx;
			position: relative;
			background-color: $page-color-base;

			.arc {
				position: absolute;
				left: 0;
				top: -34upx;
				width: 100%;
				height: 36upx;
			}

			.promotion-center {
				background: #fff;
				margin-bottom: 20upx;

				/*分类列表*/
				.category-list {
					width: 100%;
					padding: 0 0 30upx 0;
					border-bottom: solid 2upx #f6f6f6;
					display: flex;
					flex-wrap: wrap;

					.category {
						width: 33.3%;
						margin-top: 50upx;
						display: flex;
						justify-content: center;
						flex-wrap: wrap;

						.img {
							width: 100%;
							display: flex;
							justify-content: center;

							.iconfont {
								font-size: $font-lg + 24upx;
							}
						}

						.text {
							width: 100%;
							display: flex;
							justify-content: center;
							font-size: 24upx;
							color: #3c3c3c;
						}

						.share-btn {
							height: 142upx;
							text-align: left;
							background: none;
							padding: 0;
							margin: 0;
						}

						.share-btn:after {
							border: none;
							border-radius: none;
						}
					}
				}
			}

			.tj-sction {
				@extend %section;
				display: flex;

				.tj-item {
					@extend %flex-center;
					flex: 1;
					flex-direction: column;
					margin: 30upx 0;
					font-size: $font-sm;
					color: #75787d;
					/*border-right: 2upx solid rgba(0, 0, 0, 0.2);*/
				}

				/*.tj-item:last-child {*/
				/*border-right: none;*/
				/*}*/
				.num {
					font-size: $font-base;
				}

				.red {
					color: $base-color;
				}
			}

		}
	}

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		justify-content: space-around;
		display: flex;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}
</style>
