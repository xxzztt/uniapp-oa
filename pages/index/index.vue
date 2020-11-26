<template>
	<view class="notify">
		<view class="promotion-center">
			<view class="tj-sction">
				<!-- 轮播图1 -->
				<view class="swiper">
					<view class="swiper-box">
						<oa-swipe-dot
							:info="advList"
							mode="nav"
							:current="current"
							field="adv_title"
						>
							<swiper @change="handleDotChange" autoplay="true">
								<swiper-item
									v-for="(item, index) in advList"
									@tap="navToNews(`/pages/study/detail?id=${item.jump_link}`)"
									:key="index"

								>
									<view class="swiper-item">
										<image :src="item.cover" mode="aspectFill" />
									</view>
								</swiper-item>
							</swiper>
						</oa-swipe-dot>
					</view>
				</view>
			</view>
		</view>
		<view class="promotion-center">
			<list-cell icon="icongonggao" :iconColor="themeColor.color" @eventClick="navToLogin('/pages/notice/notice')" title="通知公告"></list-cell>
		</view>
		<view class="notify-list" v-if="notifyList.length > 0">
			<view v-for="(item, index) in notifyList" :key="index" class="row" @tap="navTo(item)">
				<!--  -->
				<view class="carrier">
					<view class="notify-wrapper">
						<view class="title in3line">{{item.notifySenderForMember.title}}</view>
						<!-- <view class="content in2line"><oa-parser lazy-load :html="item.notifySenderForMember.content"></oa-parser></view> -->
						<view class="time">{{item.created_at | time}}</view>
						<uni-tag class="type" type="error" :text="item.type | notifyTypeFilter" size="small" />
						<view class="un-read" :class="'bg-'+themeColor.name" v-if="item.is_read.toString() === '0'"></view>
					</view>
				</view>
				<oa-load-more v-if="notifyList.length > 0" :status="loadingType" />
			</view>
		</view>
		<view v-if="!hasLogin" class="notify-empty">
			<view class="empty-tips">
				暂未登录
				<view class="navigator" :class="'text-'+themeColor.name" @tap="navToLogin('/pages/public/login')">登录/注册 ></view>
			</view>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!--版本更新-->
		<!-- #ifdef APP-PLUS -->
		<oa-version-upgrade
			isTipsShow
			@tip="handleTip"
			@close="handleVersionUpgradeShow"
			:isShow="isVersionUpgradeShow"
		></oa-version-upgrade>
		<!-- #endif -->
	</view>

</template>
<script>
	import {
		notifyIndex,
		notifyRead
	} from '@/api/userInfo';
	import rfVersionUpgrade from '@/components/oa-version-upgrade';
	import rfLoadMore from '@/components/oa-load-more/oa-load-more';
	import moment from '@/common/moment';
	import mConstDataConfig from '@/config/constData.config';
	import listCell from '@/components/oa-list-cell';
	import { advList } from '@/api/basic';
	import {
		mapMutations
	} from 'vuex';
	import oaSwipeDot from '@/components/oa-swipe-dot';
	import rfSwiperSlide from '@/components/oa-swiper-slide';
	export default {
		components: {
			rfLoadMore,
			listCell,
			oaSwipeDot,
			rfSwiperSlide,
			rfVersionUpgrade
		},
		data() {
			return {
				isNewVersion: false,
				isVersionUpgradeShow: false,
				current: 0, // 轮播图index
				advList: [], // 广告图
				loading: true,
				notifyList: [],
				logo: this.$mSettingConfig.appLogo,
				loadingType: 'more',
				page: 1,
				hasLogin: false,
				// 控制滑动效果
				theIndex: null,
				oldIndex: null,
				menuList: this.$mConstDataConfig.menuList,
			};
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			},
			notifyTypeFilter(val) {
				return mConstDataConfig.notifyTypeList[val].content;
			}
		},
		onShow() {
			this.initData();
		},
		computed: {
			bottom() {
				let bottom = 0;
				/*  #ifdef H5  */
				bottom = 90;
				/*  #endif */
				return bottom;
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.notifyList = [];
			this.loading = true;
			this.getNotifyList('refresh');
			this.getAdvList('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getNotifyList();
		},
		methods: {
			...mapMutations(['setNotifyNum']),
			handleTip(isNewVersion) {
				this.isNewVersion = isNewVersion;
			},
			handleVersionUpgradeShow() {
				this.isVersionUpgradeShow = false;
			},
			// 监听轮播图切换
			handleDotChange(e) {
				this.current = e.detail.current;
			},
			// 数据初始化
			initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				// if(!this.hasLogin){
				// 	this.$mRouter.push({
				// 		route: '/pages/public/login'
				// 	});
				// }
				this.page = 1;
				this.loading = true;
				this.notifyList = [];
				this.getNotifyList();
				this.getAdvList();
				uni.setNavigationBarColor({
				    frontColor: '#ffffff',
				    backgroundColor: this.themeColor.color,
				    animation: {
				        duration: 400,
				        timingFunc: 'easeIn'
				    }
				})
			},
			// 跳至广告图指定页面
			indexTopToDetailPage(item) {
				this.$mHelper.handleBannerNavTo(item.jump_type, item.jump_link, item.id);
			},
			//获取广告信息
			async getAdvList(type) {
				await this.$http
					.get(`${advList}`, {cate_id:1})
					.then(async r => {
						// uni.setNavigationBarTitle({ title: this.appName });
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						// 首页Adv赋值
						// console.log(r.data);
						this.advList = r.data;
						this.loading = false;
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			// 获取消息列表
			async getNotifyList(type) {
				// if (!this.hasLogin) {
				// 	this.loading = false;
				// 	if (type === 'refresh') uni.stopPullDownRefresh();

				// 	return;
				// }
				await this.$http.get(notifyIndex, {
					page: this.page
				}).then(r => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					// this.initNotifyNum();
					this.loadingType = r.data.length === 10 ? 'more' : 'nomore';
					this.notifyList = [...this.notifyList, ...r.data];
				}).catch(() => {
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.loading = false;
				});
			},
			async navToNews(route) {
				this.$mRouter.push({
					route
				});
			},
			// 通用跳转
			async navTo(item) {
				let route;
				const id = item.notifySenderForMember.target_id;
				const notifyId = item.notifySenderForMember.id;
				if (item.is_read.toString() === '0') {
					await this.$http.get(notifyRead, {
						notify_id: notifyId
					}).then(() => {
						this.page = 1;
						this.loading = true;
						this.notifyList = [];
						this.getNotifyList();
					});
				}
				// console.log('ok');
				this.$mRouter.push({
					route: `/pages/notice/detail?id=${item.id}`
				});
			},

			// 通用跳转
			navToLogin(route) {
				this.$mRouter.push({
					route
				});
			},

		}
	};
</script>
<style lang="scss">
	page {
		background-color: $page-color-base;
	}
/*轮播图*/
	.swiper {
		width: 100%;
		margin-top: 20upx;
		margin-bottom: 20upx;
		display: flex;
		justify-content: center;
		.swiper-box {
			width: 92%;
			height: 40vw;
			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;
			swiper {
				width: 100%;
				height: 40vw;
				swiper-item {
					image {
						width: 100%;
						height: 40vw;
					}
				}
			}
		}
	}
	.notify {

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

		.header {
			width: 100%;
			padding-left: $font-lg;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			z-index: 10;
			background-color: #fff;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);

			/*  #endif  */
			.title {
				font-size: 36upx;
			}
		}

		.place {
			background-color: #ffffff;
			height: 100upx;
			/*  #ifdef  APP-PLUS  */
			margin-top: var(--status-bar-height);
			/*  #endif  */
		}

		.notify-list {
			.read {
				text-align: right;
				margin-right: $spacing-base;
				margin-top: $spacing-base;
				margin-bottom: $spacing-sm;

				text {
					margin-left: $spacing-base;
				}
			}

			.row {
				width: calc(94%);
				height: calc(22vw + 40upx);
				margin: 0 auto $spacing-base;
				border-radius: 15upx;
				box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
				display: flex;
				align-items: center;
				position: relative;
				overflow: hidden;
				z-index: 4;
				border: 0;

				.menu {
					.iconfont {
						color: #fff;
						font-size: 60upx;
					}

					position: absolute;
					width: 29%;
					height: 100%;
					right: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #fff;
					z-index: 2;
				}

				.carrier {
					@keyframes showMenu {
						0% {
							transform: translateX(0);
						}

						100% {
							transform: translateX(-30%);
						}
					}

					@keyframes closeMenu {
						0% {
							transform: translateX(-30%);
						}

						100% {
							transform: translateX(0);
						}
					}

					&.open {
						animation: showMenu 0.25s linear both;
					}

					&.close {
						animation: closeMenu 0.15s linear both;
					}

					background-color: #fff;
					position: absolute;
					width: 100%;
					padding: 0 0;
					height: 100%;
					z-index: 3;
					display: flex;
					align-items: center;
				}
			}

			.notify-wrapper {
				background-color: $color-white;
				width: 100%;
				padding: $spacing-base $spacing-lg $spacing-base 80upx;
				margin: $spacing-base 0 0;
				border-radius: 15upx;
				position: relative;

				.title {
					font-size: $font-lg;
					color: $font-color-dark;
					font-weight: 500;
					margin: 0 0 $spacing-sm;
				}

				.content {
					font-size: $font-sm;
					color: $font-color-base;
					height: 75upx;
					line-height: 36upx;
				}

				.time {
					font-size: $font-base;
					color: $font-color-light;
				}

				.type {
					position: absolute;
					top: 26upx;
					left: -10upx;
					border: none;
					font-size: $font-sm;
					opacity: 0.8;
				}

				.un-read {
					display: inline-block;
					width: 12upx;
					height: 12upx;
					border-radius: 50%;
					position: absolute;
					top: 32upx;
					right: 30upx;
				}
			}
		}

		.notify-empty {
			position: fixed;
			left: 0;
			top: 50;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			.iconfont {
				font-size: $font-lg + 100upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					margin-left: 16upx;
				}
			}
		}
	}
</style>
