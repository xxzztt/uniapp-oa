<template>
	<view class="page">
		<view class="input-t ">
			<text>选择员工</text>
			<view class="tit">
					<picker @change="bindTypeChange" :value="index" :range="employees" range-key="value">
						<view class="uni-input">{{employees[index].value}}</view>
					</picker>
			</view>
		</view>
		<view class="input-t ">
			<text>交纳金额</text>
			<input class="input tit" type="text" v-model="sendDate.pay_amount" placeholder="请输入交纳金额" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>交纳日期</text>
			<picker mode="date" v-model="sendDate.pay_time" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					pay_time || '请选择日期'
				}}</view>
			</picker>
		</view>
		<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="send">
			确定提交
		</button>

	</view>
</template>

<script>
	import {
		uploadImage
	} from '@/api/userInfo';
	import {
		insurance,
		getEmployees
	} from '@/api/basic';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				type: [],
				index: 0,
				rewardsType:[],
				employees:[],
				sendDate: {},
				pay_time: moment().format('YYYY-MM-DD'),
				btnLoading: false
			};
		},
		onShow() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.themeColor.color,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		onShow() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.themeColor.color,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		async onLoad(options) {
			await this.getEmployees();
		},
		methods: {
			bindTypeChange(e) {
				this.index = e.detail.value;
			},
			bindDateChange(e) {
				this.pay_time = e.target.value;
			},
			async getEmployees() {
				await this.$http
					.get(`${getEmployees}`, {})
					.then(r => {
						this.employees = r.data;
					})
			},
			// 发送数据
			async send() {
				this.btnLoading = true;
				this.sendDate.pay_time = this.pay_time;
				this.sendDate.employees_id = this.employees[this.index].key;
				await this.$http
					.post(`${insurance}` + `/create`, {
						...this.sendDate
					})
					.then(() => {
						this.btnLoading = false;
						this.$mRouter.back();
					})
					.catch(() => {
						this.btnLoading = false;
					});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: $page-color-base;
	}
	.cu-form-group {
		border-style: none;
		background-color: $page-color-base;
		padding: $spacing-base;
		width: 100%;
		display: flex;
		align-items: center;
		// min-height: 100upx;
		justify-content: space-between;
	}
	/*表单标题*/
	.input-t {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: $spacing-base;
		margin-top: $spacing-base;
		font-size: $font-base;

	}

	.tit {
		width: 80%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}

	.input-quick {
		position: relative;
		padding-right: 40upx;

		.iconfont {
			font-size: $font-sm;
		}
	}

	.input-body {
		background: $color-white;
		padding: $spacing-sm $spacing-base;

		.gender-item {
			margin-right: 20upx;

			.gender-item-text {
				padding-left: 10upx;
			}

		}
	}

	.input-textare {
		height: 200upx;
		font-size: 34upx;
		line-height: 50upx;
		width: 100%;
		box-sizing: border-box;
		padding: 20upx 30upx 0;
	}
	.covers-title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: $spacing-base;
		margin-top: $spacing-base;
		font-size: $font-base;

	}
	.covers-body {
		background: $color-white;
		padding: $spacing-sm $spacing-base;
		.gender-item {
			margin-right: 20upx;

			.gender-item-text {
				padding-left: 10upx;
			}

			radio .wx-radio-input.wx-radio-input-checked {
				background: $uni-color-primary;
				border-color: $uni-color-primary;
			}
		}
	}
	.covers-uploader {
		padding: 22upx 20upx;
	}
</style>
