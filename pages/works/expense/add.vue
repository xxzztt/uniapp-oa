<template>
	<view class="page">
		<view class="input-t" @tap.stop="chooseType">
			<text>报销类型</text>
			<text class="input-quick">{{ mtype || '请选择报销类型' }} <text class="iconfont iconxia"></text></text>
		</view>
		<view class="input-t ">
			<text>报销金额</text>
			<input class="input tit" type="text" v-model="sendDate.amount" placeholder="请输入金额,保留两位小数" placeholder-class="placeholder" />
		</view>
		<view class="input-t">
			<text>报销理由</text>
			<text class="input-quick"></text>
		</view>
		<view class="input-body">
			<textarea placeholder="请详细描述您要报销的理由..." v-model="sendDate.content" class="input-textare" />
			</view>
		<view class="input-t">
			<text>提醒方式</text>
		</view>
		<view class="input-body">
			<radio-group @change="handleRemindTypeChange">
				<label
					class="gender-item"
					v-for="(item, index) in remindType"
					:key="index"
				>
					<radio
						class="gender-item-radio"
						:color="themeColor.color"
						:value="item.value"
						:checked="item.value === sendDate.remind"
					/>
					<text class="gender-item-text">{{ item.name }}</text>
				</label>
			</radio-group>
		</view>
		<view class="covers-title">
			<text>报销凭证(请上传报销凭证图片，包括：发票、收据等)</text>
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
			提交申请
		</button>

	</view>
</template>

<script>
import { uploadImage } from '@/api/userInfo';
import { expense,expenseType } from '@/api/basic';
export default {
	data() {
		return {
			type:'',
			mtype:'',
			mtypeValue:'',
			remindType: [{value: '0',name: '不提醒'},{value: '1',name: '消息提醒'},{value: '2',name: '短信提醒'}],
			sendDate: {
				remind:'0',
				content: ''
			},
			worksType:[],
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
		await this.getworksType();
	},
	methods: {
		// 监听反馈类型事件
		handleRemindTypeChange(e) {
			this.sendDate.remind = e.detail.value;
		},

		async getworksType() {
			await this.$http
				.get(`${expenseType}`, {})
				.then(r => {
					this.worksType = r.data;
				})
				.catch(() => {
					this.loading = false;
					if (mtype === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		chooseType() {
			uni.showActionSheet({
				itemList: this.worksType,
				success: res => {
					this.mtype = this.worksType[res.tapIndex];
					this.mtypeValue = res.tapIndex;
				},
				fail: res => {
					console.log(res);
				}
			});
		},
		// 打开相册选图
		uploadImage() {
			const _this = this;
			uni.chooseImage({
				count: 6, // 最多一次可以选择的图片张数
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
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
			this.btnLoading = true;
			// this.sendDate.type = this.mtype;
			this.sendDate.cate_id = this.mtypeValue;
			this.sendDate.covers = JSON.stringify(this.imageList);
			this.sendDate.status = 'expense/apply';
			// console.log(this.sendDate);
			await this.$http
				.post(`${expense}`+`/create`, {
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
