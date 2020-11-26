<template>
	<view class="user">
		<!--头部-->
		<!-- 个人中心 内容区-->
		<view class="cover-container">
			<!--机构统计-->
			<view class="promotion-center">
				<list-cell icon="icontubiao2" :iconColor="themeColor.color" title="机构统计"></list-cell>
				<view class="tj-sction">
					<view class="tj-item" v-for="item in merchantList" :key="item.title" @tap="navTo(item.url)">
						<text class="num in1line" :class="item.value > 0 ? 'text-'+themeColor.name : ''">
							{{ item.value }}
						</text>
						<text>{{ item.title }}</text>
					</view>
				</view>
				<view class="tj-sction">
					<view class="tj-item" v-for="item in timeList" :key="item.title" @tap="getmerchantInfo(item.value)">
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view>

			<!--分段统计-->
		<!-- 	<view class="promotion-center">
				<list-cell icon="icontubiao2" :iconColor="themeColor.color" title="分段统计"></list-cell>
				<view class="tj-sction">
					<view class="tj-item" v-for="item in timeList" :key="item.title" @tap="getmerchantInfo(item.value)">
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view> -->

			<view class="qiun-charts-rotate">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts-rotate" :width="cWidth2*pixelRatio" :height="cHeight2*pixelRatio"
				 :style="{'width':cWidth2+'px','height':cHeight2+'px'}" @touchstart="touchColumn"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts-rotate" @touchstart="touchColumn"></canvas>
				<!--#endif-->
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
		merchantInfo
	} from '@/api/userInfo';
	import {
		mapMutations
	} from 'vuex';
	import $mAssetsPath from '@/config/assets.config';
	import listCell from '@/components/oa-list-cell';
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaColumn = null;

	export default {
		components: {
			listCell,
		},
		data() {
			return {
				merchantList: this.$mConstDataConfig.merchantList,
				timeList: this.$mConstDataConfig.timeList,
				merchantInfo: {},
				loading: true,
				hasLogin: false,

				cWidth2: '', //横屏图表
				cHeight2: '', //横屏图表
				pixelRatio: 1,
				time:''
			};
		},
		onLoad() {


			this.initData();
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 2;
					}
				}
			});
			//#endif
			this.cWidth2 = uni.upx2px(720);
			this.cHeight2 = uni.upx2px(2000);
		},

		methods: {
			// ...mapMutations(['login']),
			// 数据初始化
			async initData() {
				// this.time = event.time;
				// this.getmerchantInfo(event.time);
				this.getmerchantInfo();
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
			},

			showColumnColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					padding: [15, 15, 0, 15],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: false,
					rotate: true,
					// #ifdef MP-ALIPAY
					rotateLock: true, //百度及支付宝需要锁定旋转
					// #endif
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						// gridType:'dash',
						// splitNumber:4,
						// minInterval: 1,
						//   type : 'value',
						// 	axisLabel: {
						// 		formatter: function (value, index) {
						// 		return value.toFixed(1);
						// 	}
						// }
					},
					dataLabel: true,
					width: _self.cWidth2 * _self.pixelRatio,
					height: _self.cHeight2 * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length,
							meter: {
								//这个是外层边框的宽度
								border: 4,
								//这个是内部填充颜色
								fillColor: '#E5FDC3'
							}
						}
					}
				});

			},
			touchColumn(e) {
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			// 获取机构信息
			async getmerchantInfo(time) {
				await this.$http
					.get(merchantInfo+'?time='+`${time}`)
					.then(async r => {
						// console.log(r.data);
						this.loading = false;
						this.merchantInfo = r.data;
						// this.title = userInfo.cate_title;
						await this.setSectionData(r.data);
						//图表赋值
						let ColumnColumn = {
							categories: [],
							series: []
						};
						ColumnColumn.categories = r.data.categories;
						ColumnColumn.series = r.data.series;
						_self.showColumnColumn("canvasColumn", ColumnColumn);
						//设置标题
						uni.setNavigationBarTitle({
							title: this.merchantInfo.merchant_title
						});
					})
					.catch(() => {
						this.hasLogin = false;
						this.merchantInfo = {};
						this.resetSectionData();
						this.loading = false;
					});
			},
			async getServerData() {
				await this.$http
					.get(merchantInfo)
					.then(async r => {
						// console.log(r.data);
						let Column = {
							categories: [],
							series: []
						};
						Column.categories = r.data.categories;
						Column.series = r.data.series;
						_self.showColumn("canvasColumn", Column);
					})
					.catch(() => {
						this.loading = false;
					});
			},

			// 清空个人中心的各模块状态
		async	resetSectionData() {
				this.merchantInfo = {};
				this.merchantList[0].value = 0;
				this.merchantList[1].value = 0;
				this.merchantList[2].value = 0;
				this.user_integral = 0;

			},
			// 给个人中心的各模块赋值
		async	setSectionData(data) {
				this.merchantList[0].value = data.visit_num || 0;
				this.merchantList[1].value = data.secret_num || 0;
				this.merchantList[2].value = data.meeting_num || 0;
				this.user_integral = data.user_integral;

				this.timeList[0].value = 'thisWeek';
				this.timeList[1].value = 'thisMonth';
				this.timeList[2].value = 'thisYear';
				this.timeList[3].value = 'lastYear';

				// console.log(this.merchantInfo);
				// 更新userInfo缓存
				uni.setStorageSync('merchantInfo', data);
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
					this.$mRouter.push({
						route
					});
				}
			},

		}
	};
</script>
<style lang="scss" scoped>
	page {
		background-color: $page-color-base;
	}

	.user {
		.cover-container {
			margin-top: 10upx;
			// padding: 0 30upx 20upx;
			position: relative;
			background-color: $page-color-base;

			.qiun-charts-rotate {
				// width: 720upx;
				height: 2000upx;
				background-color: #FFFFFF;
				padding: 25upx;
			}

			.charts-rotate {
				width: 720upx;
				height: 1980upx;
				background-color: #FFFFFF;
			}

			.promotion-center {
				background: #fff;
				margin-bottom: 20upx;

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
					}

					.num {
						font-size: $font-base;
					}

					.red {
						color: $base-color;
					}
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
