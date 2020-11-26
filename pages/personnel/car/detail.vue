<template>
	<view class="page">
		<view class="input-t ">
			<text>车型</text>
			<view class="tit">
				<picker @change="bindTypeChange" :value="typeindex" :range="type">
					<view class="uni-input">{{type[typeindex]}}</view>
				</picker>
			</view>
		</view>
		<view class="input-t ">
			<text>名称</text>
			<input class="input tit" type="text" v-model="sendDate.title" placeholder="请输入车辆名称或型号" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>车牌号</text>
			<input class="input tit" type="text" v-model="sendDate.plate_number" placeholder="请输入车牌号" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>行驶证</text>
			<input class="input tit" type="text" v-model="sendDate.vehicle_license" placeholder="请输入行驶证" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>里程(KM)</text>
			<input class="input tit" type="text" v-model="sendDate.mileage" placeholder="请输入里程数" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>保险到期</text>
			<picker mode="date" v-model="sendDate.insurance" @change="bindInsuranceChange">
				<view class="date" style="background: none;">{{
					insurance || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="input-t ">
			<text>年检到期</text>
			<picker mode="date" v-model="sendDate.inspection" @change="bindInspectionChange">
				<view class="date" style="background: none;">{{
					inspection || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view >状态</view>
				<radio-group  @change="handleStateChange">
					<label class="radio margin-right" v-for="(item, index) in state" :key="index"><radio :value="item.key"
						:checked="item.key === sendDate.state" :color="themeColor.color"  style="transform: scale(0.75);"/>{{ item.value }}</label>
				</radio-group>
		</view>
		<view class="input-t">
			<text>备注</text>
		</view>
		<view class="input-body">
			<textarea placeholder="请输入车辆备注" v-model="sendDate.mark" class="input-textare" />
			</view>
		<view class="covers-title">
			<text>上传图片(请上传图片)</text>
		</view>
		<view class="covers-body covers-uploader oa-uploader" >
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
		car,
		carType,
		carState,
	} from '@/api/basic';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				id: undefined,
				type: [],
				state: [],
				imageList: [],
				typeindex: 0,
				stateindex: 0,
				sendDate: {
					state:0,
				},
				inspection: moment().format('YYYY-MM-DD'),
				insurance: moment().format('YYYY-MM-DD'),
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
			await this.getcarType();
			await this.getcarState();

		},
		methods: {
			bindTypeChange(e) {
				this.typeindex = e.target.value
			},
			handleStateChange(e) {
				// this.stateindex = e.target.value
				this.sendDate.state = e.detail.value;
			},
			bindInsuranceChange(e) {
				this.insurance = e.target.value;
			},
			bindInspectionChange(e) {
				this.inspection = e.target.value;
			},
			async getcarType() {
				await this.$http
					.get(`${carType}`, {})
					.then(r => {
						this.type = r.data;
					})
			},
			// 获取详情
			async getDetail(id) {
				await this.$http
					.get(`${car}`+'/view?id='+`${id}`)
					.then(r => {
						this.loading = false;
						this.sendDate = r.data;
						this.typeindex = r.data.type;
						this.inspection = r.data.inspection;
						this.insurance = r.data.insurance;
						// console.log(this.sendDate);
						this.imageList = JSON.parse(r.data.covers);
						uni.setNavigationBarTitle({
							title: r.data.title
						});
					})
					.catch(() => {
						this.loading = false;
					});
			},
			//获取状态
			async getcarState() {
				await this.$http
					.get(`${carState}`, {})
					.then(r => {
						this.state = r.data;
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
				this.sendDate.type = this.typeindex;
				this.sendDate.covers = JSON.stringify(this.imageList);
				this.sendDate.insurance = this.insurance;
				this.sendDate.inspection = this.inspection;
				await this.$http
				.put(`${car}/update?id=${this.id}`, {
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
