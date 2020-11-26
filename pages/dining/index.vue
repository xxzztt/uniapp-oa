<template>
	<view class="get">
		<view class="get-list">
			<uni-swipe-action>
				<uni-swipe-action-item class="row" v-for="(item, index) in getList" :right-options="options" :key="item.id" @click="swipeClick($event, item.id)">
					<view class="get-wrapper ">
						<view class="title in1line">
							<template v-for="(cates, index) in diningType">
								<template v-if="cates.key==item.type">{{ cates.value }}</template>
							</template>
						</view>
						<view class="content in2line">就餐人数：{{item.num}}<br>就餐日期：{{item.date}}</view>
						<view class="time">{{item.member.realname}} {{item.created_at|time}}</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<!-- <view v-for="(item, index) in List" :key="index" class="row">
				<view class="carrier">
					<view class="repair-wrapper">
						<view class="title in1line">
							<template v-for="(cates, index) in diningType">
								<template v-if="cates.key==item.type">{{ cates.value }}</template>
							</template>
						</view>
						<view class="content in2line">就餐人数：{{item.num}}<br>就餐日期：{{item.date}}</view>
						<view class="time">{{item.member.realname}} {{item.created_at|time}}</view>
					</view>
				</view>
			</view> -->
		</view>

		<view class="add-round bg-deepBlue" :class="'bg-' + themeColor.name" @click="navTo(`/pages/dining/add`)">
			<text class="cuIcon-add text-xxl"></text>
		</view>
		<oa-load-more v-if="getList.length > 0" :status="loadingType" />
		<oa-empty :info="'还没有内容~'" v-if="getList.length === 0 && !loading"></oa-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>

</template>

<script>
	import {
		dining,
		diningType
	} from '@/api/basic';
	import rfLoadMore from '@/components/oa-load-more/oa-load-more';
	import moment from '@/common/moment';
	import $mAssetsPath from '@/config/assets.config';
	import mConstData from '@/config/constData.config';
	import oaEmpty from '@/components/oa-empty';
	export default {
		components: {
			rfLoadMore,oaEmpty
		},
		data() {
			return {
				options: [{
					text: '编辑',
				}, {
					text: '删除',
					style: {
						backgroundColor: '#ff536f'
					}
				}],
				getList: [],
				diningType: [],
				page: 1,
				loadingType: 'more',
				loading: true,
				hasLogin: false,
			};
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			},

		},
		onShow() {
			this.initData();
			// console.log(this.workState);
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.getList = [];
			this.loading = true;
			this.getDiningList('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getDiningList();
		},
		// async onLoad(options) {},
		methods: {

			// 数据初始化
			initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.page = 1;
				this.getList.length = 0;
				this.getDiningList();
				this.getDiningType();
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.themeColor.color,
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				})
			},

			//获取类型
			async getDiningType() {
				await this.$http
					.get(`${diningType}`, {})
					.then(r => {
						this.diningType = r.data;
					})
					.catch(() => {
						this.loading = false;
						if (mtype === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			// 获取列表
			async getDiningList(type) {
				await this.$http
					.get(`${dining}`, {
						page: this.page,
					})
					.then(r => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						this.loadingType = r.data.length === 10 ? 'more' : 'nomore';
						this.getList = [...this.getList, ...r.data];
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			// 删除记录
			async deleteItem(id) {
				await this.$http
					.delete(`${dining}/delete?id=${id}`, {
						page: this.page
					})
					.then(r => {
						this.initData();
					})
			},
			swipeClick(e, id) {
				let {
					content
				} = e;
				if (content.text === '删除') {
					uni.showModal({
						title: '提示',
						content: '删除后无法恢复，是否删除?',
						success: res => {
							if (res.confirm) {
								this.deleteItem(id);
							} else if (res.cancel) {}
						}
					});
				} else {
					this.navTo(`/pages/dining/detail?id=${id}`);
				}
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
				height: calc(22vw + 40upx);
				margin: 0 auto $spacing-base;
				border-radius: 15upx;
				box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
				// display: flex;
				align-items: center;
				position: relative;
				overflow: hidden;
				z-index: 4;
				border: 0;

				.carrier {
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
				// margin: $spacing-base 0 0;
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

	}
</style>
