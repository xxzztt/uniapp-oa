<template>
	<view class="get">
		<view>
			<uni-calendar :insert="true" :lunar="true" :selected="selected" @change="change" />
		</view>
		<view class="get-list">
			<view v-for="(item, index) in recordList" :key="index" class="row" @tap="navTo(item)">
				<view class="carrier">
					<view class="get-wrapper">
						<view class="title in1line">
							{{item.attendClasses.title}}<template v-if="item.type==1">[签退]</template><template v-if="item.type==0">[签到]</template>
						</view>
						<view class="content in2line">
							<template v-for="(record, index) in checkState">
								<template v-if="record.key==item.state">考勤状态:{{ record.value }}(上班时间:{{item.attendClasses.begin_time}}-{{item.attendClasses.end_time}})</template>
							</template>
						</view>
						<view class="time">{{item.member.realname}} {{item.created_at|time}} </view>
					</view>
				</view>
			</view>
		</view>

		<view class="add-round bg-deepBlue" :class="'bg-' + themeColor.name" @click="navToAdd(`/pages/attend/add`)">
			<text class="cuIcon-add text-xxl"></text>
		</view>
		<oa-load-more v-if="recordList.length > 0" :status="loadingType" />
		<oa-empty :info="'还没有内容~'" v-if="recordList.length === 0 && !loading"></oa-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>

</template>

<script>
	import {
		check,
		attendPlan,
		attendPlanState,
		attendCheckState
		// getCarType
	} from '@/api/basic';
	import uniCalendar from '@/components/oa-calendar/oa-calendar.vue'
	import rfLoadMore from '@/components/oa-load-more/oa-load-more';
	import moment from '@/common/moment';
	import $mAssetsPath from '@/config/assets.config';
	import mConstData from '@/config/constData.config';
	import oaEmpty from '@/components/oa-empty';
	export default {
		components: {
			rfLoadMore,
			uniCalendar,oaEmpty
		},
		data() {
			return {
				today: undefined,
				selectdate: undefined,
				startTime: moment().startOf('day').format('YYYY-MM-DD'),
				getList: [],
				planState: [],
				checkState: [],
				selected: [],
				shijian: [],
				planList: [],
				recordList: [],
				page: 1,
				loadingType: 'more',
				loading: true,
				hasLogin: false,
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
		onShow() {
			this.initData();
		},
		// async onLoad(options) {
		// 	this.initData();
		// },
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.getList = [];
			this.recordList = [];
			this.loading = true;
			this.getPlanList('refresh');
			this.getRecordList('refresh', this.selectdate);
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getRecordList('', this.selectdate);
		},
		async onLoad(options) {},
		methods: {
			change(e) {
				if (e.type !== 0) this.selectdate = e.fulldate;
				else this.selectdate = '9999';
				this.getRecordList('refresh', this.selectdate);
				// console.log(this.selectdate);
			},
			// 数据初始化
			initData() {
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.page = 1;
				this.recordList.length = 0;
				this.getList.length = 0;
				// this.planList.length = 0;
				this.getCheckState();
				this.getPlanList();
				this.getRecordList('', this.selectdate);
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.themeColor.color,
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				})
			},

			// 获取计划列表
			async getPlanList(type) {
				this.getList = [];
				await this.$http
					.get(`${attendPlan}`, {
						page: this.page,
					})
					.then(r => {
						this.loading = false;
						if (type === 'refresh') {
							this.planList = [];
							uni.stopPullDownRefresh();
						}
						this.loadingType = r.data.length === 10 ? 'more' : 'nomore';
						this.getList = [...this.getList, ...r.data];
						//所有计划
						for (let i = 0, m = 0; i < this.getList.length; i++) {
							// 字符串转化为数组
							let check = this.getList[i].check_date.split(",");

						}
						for (let i = 0; i < this.getList.length; i++) {
							this.shijian.push(this.getList[i].check_date);
						}
						// 转化为字符串
						this.shijian = this.shijian.toString();
						// 字符串转化为数组
						this.shijian = this.shijian.split(",");
						// 去重时间数组
						var arr = [...new Set(this.shijian)];
						this.shijian = arr.sort((a, b) => {
							return a > b
						});
						// 动态赋值给selected;
						for (let j = 0; j < this.shijian.length; j++) {
							this.selected.push({
								date: this.shijian[j],
								info: "考勤"
							});
						}
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			// 获取记录列表
			getRecordList(type, date) {
				this.recordList = [];
				if (date) this.today = date;
				else this.today = '9999';
				this.$http
					.get(`${check}`, {
						page: this.page,
						date: this.today
					})
					.then(r => {
						if (type === 'refresh') {
							this.recordList = [];
							uni.stopPullDownRefresh();
						}
						this.recordList = r.data;
						// console.log(this.recordList);
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			//获取状态
			async getCheckState() {
				await this.$http
					.get(`${attendCheckState}`, {})
					.then(r => {
						this.checkState = r.data;
					})
			},
			navToAdd(route) {
				this.$mRouter.push({
					route: route
				});
			},
			navTo(item) {
				if (item.state == 0)
					this.$mRouter.push({
						route: `/pages/attend/add?id=${item.id}`
					});
				else
					uni.showToast({
						title: '该计划已经打过卡',
						icon: 'none',
						duration: 1000
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

	}
</style>
