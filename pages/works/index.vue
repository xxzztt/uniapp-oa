<template>
	<view class="visit">
		<view class="notify-list">
			<view v-for="(item, index) in worksList" :key="index" class="row" @tap="navTo(`/pages/works/detail?id=${item.id}`)">
				<view class="carrier">
					<view class="notify-wrapper">
						<view class="title in1line">{{item.member.realname}}</view>
						<view class="content in2line">{{item.content}}</view>
						<view class="time">{{item.created_at | time}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<oa-load-more v-if="worksList.length > 0" :status="loadingType" />
		<oa-empty :info="'还没有内容~'" v-if="worksList.length === 0 && !loading"></oa-empty>
		<view v-if="!hasLogin" class="works-empty">
			<text class="iconfont iconxiaoxi-" :class="'text-'+themeColor.name"></text>
			<view class="empty-tips">
				暂未登录
				<view class="navigator" :class="'text-'+themeColor.name" @tap="navToLogin('/pages/public/login')">登录/注册 ></view>
			</view>
		</view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>

</template>

<script>
	import {
		worksList
	} from '@/api/userInfo';
	import rfLoadMore from '@/components/oa-load-more/oa-load-more';
	import moment from '@/common/moment';
	import $mAssetsPath from '@/config/assets.config';
	import oaEmpty from '@/components/oa-empty';
	export default {
		components: {
			rfLoadMore,oaEmpty
		},
		data() {
			return {
				worksList: [],
				page: 1,
				// cate_id: '',
				loadingType: 'more',
				loading: true,
				hasLogin: false,
				moneySymbol: this.moneySymbol,
				// 控制滑动效果
				theIndex: null,
				oldIndex: null
			};
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			},
		},
		async onShow(options) {
			// this.cate_id = options.cate_id;
			await this.initData();
		},

		// async onLoad(options) {
		// 	// this.cate_id = options.cate_id;
		// 	await this.initData();
		// },
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.worksList = [];
			this.loading = true;
			this.getworksList('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getworksList();
		},
		// async onLoad(options) {
		// 	await this.initData();
		// },
		methods: {

			// 数据初始化
			initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.page = 1;
				this.worksList.length = 0;
				this.getworksList();
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.themeColor.color,
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				})
			},
			// 获取资料列表
			async getworksList(type) {
				if (!this.hasLogin) {
					this.loading = false;
					if (type === 'refresh') uni.stopPullDownRefresh();
					uni.removeTabBarBadge({
						index: this.$mConstDataConfig.worksIndex
					});
					return;
				}
				await this.$http.get(`${worksList}`, {
						page: this.page
					}).then(r => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						this.loadingType = r.data.length === 10 ? 'more' : 'nomore';
						this.worksList = [...this.worksList, ...r.data];
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			navToLogin(route) {
				this.$mRouter.push({
					route
				});
			},
			navTo(route) {
				this.$mRouter.push({
					route
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: $page-color-base;
	}

	.visit {
		.uni-media-list-logo {
			width: 180rpx;
			height: 140rpx;
		}

		.uni-media-list-body {
			height: auto;
			justify-content: space-around;
		}

		.uni-media-list-text-top {
			height: 74rpx;
			font-size: 28rpx;
			overflow: hidden;
		}

		.uni-media-list-text-bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.add-round {
			position: fixed;
			z-index: 999;
			right: 30rpx;
			bottom: 30rpx;
			border-radius: 50%;
			width: 120rpx;
			height: 120rpx;
			color: #fff;
			text-align: center;
			line-height: 120rpx;
			font-weight: 100;
			font-size: 80rpx;
		}

		.notify-list {
			margin-top: 20upx;

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
				padding: $spacing-base $spacing-lg $spacing-base $spacing-lg;
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
			top: 0;
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
		.works-empty {
					position: fixed;
					left: 0;
					top: 0;
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
