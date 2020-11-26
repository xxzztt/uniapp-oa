<template>
	<view class="page">

		<view class="input-t ">
			<text>采购类型</text>
			<view class="tit">
				<picker @change="bindPickerChange" :value="index" :range="purchaseType">
					<view class="uni-input">{{purchaseType[index]}}</view>
				</picker>
			</view>
		</view>
		<view class="input-t ">
			<text>采购金额</text>
			<input class="input tit" type="text" v-model="sendDate.amount" placeholder="请输入金额,保留两位小数" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>采购日期</text>
			<picker mode="date" v-model="sendDate.date" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					date || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="input-t">
			<text>备注</text>
		</view>
		<view class="input-body">
			<textarea placeholder="请输入简短备注..." v-model="sendDate.mark" class="input-textare" />
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
		purchase,
		getPurchaseType,
	} from '@/api/basic';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				purchaseType: [],
				index: 0,
				date: moment().format('YYYY-MM-DD'),
				sendDate: {},
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
			await this.getpurchaseType();
			this.id = options.id;
			this.getDetail(this.id);
		},
		methods: {
			bindPickerChange(e) {
				this.index = e.target.value
			},
			bindDateChange(e) {
				this.date = e.target.value;
			},
			async getpurchaseType() {
				await this.$http
					.get(`${getPurchaseType}`, {})
					.then(r => {
						this.purchaseType = r.data;
					})
			},
			// 获取详情
				async getDetail(id) {
					await this.$http
						.get(`${purchase}`+'/view?id='+`${id}`)
						.then(r => {
							this.loading = false;
							this.sendDate = r.data;
							this.index = r.data.type;
							this.date = r.data.date;
							// console.log(this.sendDate);
							uni.setNavigationBarTitle({
								title: r.data.title
							});
						})
						.catch(() => {
							this.loading = false;
						});
				},
			// 发送数据
			async send() {
				this.btnLoading = true;
				this.sendDate.type = this.index;
				this.sendDate.date = this.date;
				await this.$http
						.put(`${purchase}/update?id=${this.id}`, {
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
</style>
