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
			<input class="input tit" type="text" v-model="sendDate.serial" placeholder="请输入合同编号,不能为空" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>名称</text>
			<input class="input tit" type="text" v-model="sendDate.title" placeholder="请输入合同名称,不要超过60个字符" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>甲方</text>
			<input class="input tit" type="text" v-model="sendDate.PartyA" placeholder="请输入单价" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>乙方</text>
			<input class="input tit" type="text" v-model="sendDate.PartyB" placeholder="请输入整数" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>签定日期</text>
			<picker mode="date" v-model="sendDate.date" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					date || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="covers-title">
			<text>上传图片</text>
		</view>
		<view class="covers-body covers-uploader oa-uploader">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">点击预览图片</view>
					<view class="uni-uploader-info">{{ imageList.length }}/6</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image, index) in imageList" :key="index">
							<view class="uni-uploader__file" style="position: relative;">
								<oa-image class="uni-uploader__img" :src="image"></oa-image>
								<view class="close-view" @tap="close(index)" :class="'bg-' + themeColor.name">x</view>
							</view>
						</block>
						<view class="uni-uploader__input-box" v-if="imageList.length < 6">
							<view class="uni-uploader__input" @tap="uploadImage"></view>
						</view>
					</view>
				</view>
			</view>
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
		contract,
		getContractType,
	} from '@/api/basic';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				type: [],
				imageList: [],
				typeindex: 0,
				sendDate: {},
				date: moment().format('YYYY-MM-DD'),
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
			await this.getType();
		},
		methods: {
			bindTypeChange(e) {
				this.typeindex = e.target.value
			},
			bindDateChange(e) {
				this.date = e.target.value;
			},

			async getType() {
				await this.$http
					.get(`${getContractType}`, {})
					.then(r => {
						this.type = r.data;
					})
			},
			// 打开相册选图
			uploadImage() {
				const _this = this;
				uni.chooseImage({
					count: 6, // 最多一次可以选择的图片张数
					sizeType: ['compressed'],
					sourceType: ['camera'], // album 从相册选图，camera 使用相机
					success: function(res) {
						if (_this.imageList.length + res.tempFiles.length > 6) {
			        _this.$mHelper.toast('不要贪心哦，最多只可上传6张照片');
			        return;
						}
						_this.handleUploadFile(res.tempFilePaths);
					}
				});
			},
			// 依次上传图片
			handleUploadFile(data) {
				const _this = this;
				data.forEach(item => {
					_this.$http
						.upload(uploadImage, { filePath: item, name: 'file' })
						.then(r => {
							_this.imageList.push(r.data.url);
						});
				});
			},
			// 删除已选中图片
			close(e) {
				this.imageList.splice(e, 1);
			},
			// 发送数据
			async send() {
				this.btnLoading = true;
				this.sendDate.cate_id = this.typeindex;
				this.sendDate.date = this.date;
				this.sendDate.covers = JSON.stringify(this.imageList);
				await this.$http
					.post(`${contract}` + `/create`, {
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
