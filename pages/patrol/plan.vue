<template>
	<view class="get">
		<view>
			<uni-calendar :insert="true" :lunar="true" :selected="selected" @change="change" />
		</view>
		<view class="get-list">
			<view v-for="(item, index) in planList" :key="index" class="row" @tap="navTo(item)">
				<view class="carrier">
					<view class="get-wrapper">
						<view class="title in1line">
							<template v-for="(works, index) in planState">
								<template v-if="works.key==item.state">{{ works.value }}<template v-if="item.placestate==1">[正常]</template><template v-if="item.placestate==0">[异常]</template></template>
							</template>
						</view>
						<view class="content in2line">{{item.place.name}} {{item.patrolClasses.title}}({{item.patrolClasses.begin_time}}-{{item.patrolClasses.end_time}})<br>{{item.mark}}
						</view>
						<view class="time">{{item.member.realname}}  {{item.check_date }}  </view>
					</view>
				</view>
			</view>
		</view>

		<view class="add-round bg-deepBlue" :class="'bg-' + themeColor.name" @click="navToAdd(`/pages/patrol/add`)">
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
		record,
		patrolPlan,
		planState,
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
				today:undefined,
				selectdate:undefined,
				startTime: moment().startOf('day').format('YYYY-MM-DD'),
				getList: [],
				planState: [],
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
		// async onLoad(options) {this.initData();},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.getList = [];
			// this.recordList = [];
			this.loading = true;
			this.getPlanList('refresh',this.selectdate);
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getPlanList('',this.selectdate);
		},
		methods: {
			change(e) {
				if(e.type!==0) this.selectdate = e.fulldate;else this.selectdate='9999';
				this.getPlanList('refresh',this.selectdate);
				// console.log(this.selectdate);
			},
			// 数据初始化
			initData() {
				// console.log( moment().startOf('day').format('YYYY-MM-DD'));
				// this.selected=[{date:"2020-09-15","info": "未巡更"},{date:"2020-09-17","info": "已巡更"}];
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.page = 1;
				// this.recordList.length = 0;
				this.getList.length = 0;
				this.planList.length = 0;
				this.getRecordList();
				this.getplanState();
				this.getPlanList('',this.selectdate);
				// this.getworkType();
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
			async getPlanList(type,date) {
				this.getList = [];
				// this.recordList = [];
				if (date) this.today = date;
				else this.today = '9999';
				// console.log(this.today);
				await this.$http
					.get(`${patrolPlan}`, {
						page: this.page,
						date:this.today
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
							let planList = {};
							let check = this.getList[i].check_date.split(",");

							// console.log(check);
							// check = [...new Set(check)];
							for (let j = 0; j < check.length; j++, m++) {
								//判断是否打卡
								var planstate = 0,placestate=2,mark='';
								for (let p = 0; p < this.recordList.length; p++) {
									var created_at = this.recordList[p].created_at;
									var fulldate = moment(created_at * 1000).startOf('day').format('YYYY-MM-DD');
									// console.log( moment(created_at * 1000).startOf('day').format('YYYY-MM-DD'));
									// console.log(check[j]);
									if (fulldate === check[j] && this.recordList[p].member_id === this.getList[i].member_id && this.recordList[p].classes_id === this.getList[
											i].classes_id && this.recordList[p].place_id === this.getList[i].place_id) {
										planstate = 1;placestate=this.recordList[p].state;mark=this.recordList[p].mark;
									}
								}
								planList = {//构造计划列表
									"state": planstate,
									"placestate": placestate,
									"mark": mark,
									"id": this.getList[i].id,
									"check_date": check[j],
									"place_id": this.getList[i].place_id,
									"member_id": this.getList[i].member_id,
									"begin_time": this.getList[i].begin_time,
									"end_time": this.getList[i].end_time,
									"status": this.getList[i].status,
									"created_at": this.getList[i].created_at,
									"patrolClasses": this.getList[i].patrolClasses,
									"place": this.getList[i].place,
									"member": this.getList[i].member
								};
								//判断去重，只保留当天的计划
								if(this.today!=='9999'){
									if (this.today) this.selectdate = this.today;
									else this.selectdate = this.startTime;
								if(this.selectdate==check[j])
								this.planList.push(planList);
								}
								else
								this.planList.push(planList);
								// console.log(m);
							}
						}
						// console.log(this.planList);
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
								info: "巡更"
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
			async getRecordList(type) {
				await this.$http
					.get(`${record}`, {
						page: this.page,
					})
					.then(r => {
						this.recordList = r.data;
						// console.log(this.recordList);
					})
			},
			//获取状态
			async getplanState() {
				await this.$http
					.get(`${planState}`, {})
					.then(r => {
						this.planState = r.data;
					})
			},
			navToAdd(route){
				this.$mRouter.push({
					route:route
				});
			},
			navTo(item) {
				if (item.state == 0)
					this.$mRouter.push({
						route: `/pages/patrol/add?id=${item.id}`
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
