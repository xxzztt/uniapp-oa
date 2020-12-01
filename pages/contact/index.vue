<template>
	<view class="get">
		<view class="get-list">
			<view v-for="(item, index) in list" :key="index" class="row">
				<view class="carrier" @tap="navTo(`${item.mobile}`)">
					<view class="get-wrapper">
						<view class="title in1line">
							{{item.realname}}
						</view>
						<view class="uni-media-list-text-bottom">
							<text>部门:{{item.department&&item.department.title }} {{item.role&&item.role.title }}  </text>
							<text>电话{{item.mobile}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<uni-load-more :status="status"  :icon-size="16"  />
		<rf-empty :info="'还没有内容~'" v-if="list.length === 0 && !loading"></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>

</template>

<script>
	import {
		contact,
		// getCarType
	} from '@/api/basic';
	import moment from '@/common/moment';
	import $mAssetsPath from '@/config/assets.config';
	import mConstData from '@/config/constData.config';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				list: [],
				page: 1,
				loadingType: 'more',
				status: 'more',
				loading: true,
				hasLogin: false,
				headImg: this.$mAssetsPath.headImg,
				// 控制滑动效果
				theIndex: null,
				oldIndex: null,
				userInfo: {
					realname:'',
					mobile:'',
					merchant:null,
					department:null,
					role:null,
				},
			};
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			},

		},
		onShow() {
			this.initData();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.list = [];
			this.loading = true;
			this.getList('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getList();
		},
		async onLoad(options) {},
		methods: {
			// 数据初始化
			initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.page = 1;
				this.list.length = 0;
				// this.planList.length = 0;
				this.getList();
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.themeColor.color,
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				})
			},
			// 获取记录列表
			getList(type) {
				this.recordList = [];
				this.$http
					.get(`${contact}`, {
						page: this.page,
					})
					.then(r => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						this.loadingType = r.data.length === 10 ? 'more' : 'nomore';
						this.list = [...this.list, ...r.data];
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			navTo(mobile) {
				if (!mobile) {
					this.$mHelper.toast('还未配置电话哦');
					return;
				}
				uni.makePhoneCall({
					phoneNumber: mobile
				});
				return;
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: $page-color-base;
	}

	.get {
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

		.get-list {
			margin-top: 20upx;

			.row {
				width: calc(94%);
				height: calc(20vw);
				margin: 0 auto $spacing-base;
				border-radius: 15upx;
				box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
				display: flex;
				align-items: center;
				position: relative;
				overflow: hidden;
				z-index: 4;
				border: 0;

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

			.get-wrapper {
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

			}
		}
		
		
		.uni-media-list-logo {
			// width: 180rpx;
			// height: 140rpx;
			border-radius: 50%;
		}
		
		.uni-media-list-body {
			height: auto;
			justify-content: space-around;
		}
		
		.uni-media-list-text-top {
			height: 54rpx;
			font-size: 28rpx;
			overflow: hidden;
		}
		
		.uni-media-list-text-bottom {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}
	
</style>
