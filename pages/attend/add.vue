<template>
	<view class="page">

		<view class="cu-form-group">
			<view >班次</view>
				<radio-group  @change="handleClassesChange">
					<label class="radio margin-right" v-for="(item, index) in classesType" :key="index"><radio :value="item.key"
						:checked="item.key === sendDate.classes_id" :color="themeColor.color"  style="transform: scale(0.75);"/>{{ item.value }}</label>
				</radio-group>
		</view>
		<view class="cu-form-group">
			<view>类型</view>
			<radio-group @change="handleStateChange">
				<label class="radio margin-right" v-for="(item, index) in checkType" :key="index">
					<radio :value="item.key" :checked="item.key === sendDate.type" :color="themeColor.color" style="transform: scale(0.75);" />
					{{ item.value }}
				</label>
			</radio-group>
		</view>

		<view class="covers-title">
			<text>现场图片(请上传打卡现场图片)</text>
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
		<button
			class="confirm-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="send"
		>
			提交打卡
		</button>

	</view>
</template>

<script>
import { uploadImage } from '@/api/userInfo';
import { check,attendCheckType,getAttendClasses } from '@/api/basic';
import nativeUtil from "@/utils/native-nfc-util.js"
export default {
	data() {
		return {
			// classesType: [{key: '0',value: '早班'},{key: '1',value: '晚班'}],
			// placeState: [{key: '0',value: '正常'},{key: '1',value: '异常'}],
			sendDate: {
				classes_id:1,
				type:0,
			},
			place:{},
			checkType:[],
			classesType:[],
			imageList: [],
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
		await this.getCheckType();
		await this.getClasses();
	},
	methods: {
		// 监听反馈类型事件
		handleClassesChange(e) {
			this.sendDate.classes_id = e.detail.value;
		},
		handleStateChange(e) {
			this.sendDate.type = e.detail.value;
		},

		async getCheckType() {
			await this.$http
				.get(`${attendCheckType}`, {})
				.then(r => {
					this.checkType = r.data;
				})
		},
		async getClasses() {
			await this.$http
				.get(`${getAttendClasses}`, {})
				.then(r => {
					this.classesType = r.data;
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
			// console.log(_this.imageList);
		},
		// 删除已选中图片
		close(e) {
			this.imageList.splice(e, 1);
		},
		// 发送数据
		async send() {
			if(this.imageList.length==0){
				uni.showToast({
					title: '请上传图片',
					icon: 'none',
					duration: 1000
				});
			}else{
			this.btnLoading = true;
			// this.sendDate.type = this.mtype;
			this.sendDate.covers = JSON.stringify(this.imageList);
			// await this.getPlace(this.sendDate.label);
			// console.log(this.sendDate);
			await this.$http
				.post(`${check}`+`/create`, {
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
