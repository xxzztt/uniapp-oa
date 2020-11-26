<template>
	<view class="page">
		<view class="input-t ">
			<text>类型</text>
			<view class="tit">
				<picker @change="bindTypeChange" :value="typeindex" :range="type">
					<view class="uni-input">{{type[typeindex]}}</view>
				</picker>
			</view>
		</view>
		<view class="input-t ">
			<text>编号</text>
			<input class="input tit" type="text" v-model="sendDate.serial" placeholder="请输入资产编号,不能为空" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>名称</text>
			<input class="input tit" type="text" v-model="sendDate.title" placeholder="请输入资产名称,不要超过25个字符" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>单价</text>
			<input class="input tit" type="text" v-model="sendDate.purchase_price" placeholder="请输入单价" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>数量</text>
			<input class="input tit" type="text" v-model="sendDate.num" placeholder="请输入整数" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>单位</text>
			<input class="input tit" type="text" v-model="sendDate.unit" placeholder="请输入资产的单位,比如:台" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>部门</text>
			<input class="input tit" type="text" v-model="sendDate.department" placeholder="请输入所属部门" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>地点</text>
			<input class="input tit" type="text" v-model="sendDate.address" placeholder="请输入所在地点" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>负责人</text>
			<input class="input tit" type="text" v-model="sendDate.person" placeholder="请输入资产负责人" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>购买日期</text>
			<picker mode="date" v-model="sendDate.purchase_date" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					purchase_date || '请选择日期'
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
		asset,
		assetType,
	} from '@/api/basic';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				type: [],
				imageList: [],
				typeindex: 0,
				sendDate: {},
				purchase_date: moment().format('YYYY-MM-DD'),
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
		async onLoad(options) {
			await this.getType();
		},
		methods: {
			bindTypeChange(e) {
				this.typeindex = e.target.value
			},
			bindDateChange(e) {
				this.purchase_date = e.target.value;
			},

			async getType() {
				await this.$http
					.get(`${assetType}`, {})
					.then(r => {
						this.type = r.data;
					})
			},
			// 发送数据
			async send() {
				this.btnLoading = true;
				this.sendDate.cate_id = this.typeindex;
				this.sendDate.purchase_date = this.purchase_date;
				await this.$http
					.post(`${asset}` + `/create`, {
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
