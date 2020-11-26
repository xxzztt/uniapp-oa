<template>
	<view class="page">
		<view class="input-t ">
			<text>分类</text>
			<view class="tit">
				<picker @change="bindTypeChange" :value="typeindex" :range="type">
					<view class="uni-input">{{type[typeindex]}}</view>
				</picker>
			</view>
		</view>
		<view class="input-t ">
			<text>编号</text>
			<input class="input tit" type="text" v-model="sendDate.serial" placeholder="请输入档案编号,不能为空,如:WB20201011" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>标题</text>
			<input class="input tit" type="text" v-model="sendDate.title" placeholder="请输入档案标题,不要超过25个字符" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>文件柜</text>
			<input class="input tit" type="text" v-model="sendDate.cabinet" placeholder="请输入文件柜编号" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>文件盒</text>
			<input class="input tit" type="text" v-model="sendDate.box" placeholder="请输入文件盒编号" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>发文时间</text>
			<picker mode="date" v-model="sendDate.send_time" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					send_time || '请选择日期'
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
		archives,
		getArchivesType,
	} from '@/api/basic';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				type: [],
				imageList: [],
				typeindex: 0,
				sendDate: {},
				send_time: moment().format('YYYY-MM-DD'),
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
			this.id = options.id;
			this.getDetail(this.id);
			await this.getType();
		},
		methods: {
			bindTypeChange(e) {
				this.typeindex = e.target.value
			},
			bindDateChange(e) {
				this.send_time = e.target.value;
			},

			async getType() {
				await this.$http
					.get(`${getArchivesType}`, {})
					.then(r => {
						this.type = r.data;
					})
			},
			// 获取详情
			async getDetail(id) {
				await this.$http
					.get(`${archives}`+'/view?id='+`${id}`)
					.then(r => {
						this.loading = false;
						this.sendDate = r.data;
						this.typeindex = r.data.cate_id;
						this.send_time = r.data.send_time;
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
				this.sendDate.cate_id = this.typeindex;
				this.sendDate.send_time = this.send_time;
				await this.$http
					.put(`${archives}/update?id=${this.id}`, {
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
