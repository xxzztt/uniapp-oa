<template>
	<view class="page">
		<view class="input-t" @tap.stop="chooseType">
			<text>报修类型</text>
			<text class="input-quick"
			>{{ mtype || '请选择报修类型' }} <text class="iconfont iconxia"></text
			></text>
		</view>

		<view class="input-t">
			<text>报修内容</text>
			<text class="input-quick"></text>
		</view>
		<view class="input-body">
			<textarea
				placeholder="请详细描述您要报修的内容..."
				v-model="sendDate.content"
				class="input-textare"
			/>
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
import { repair,repairMsg,repairType } from '@/api/basic';
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
				.get(`${repairType}`, {})
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
					// console.log(this.mtypeValue);
				},
				fail: res => {
					console.log(res);
				}
			});
		},
		// 发送数据
		async send() {
			this.btnLoading = true;
			// this.sendDate.type = this.mtype;
			this.sendDate.cate_id = this.mtypeValue;
			this.sendDate.status = 'repair/apply';
			// console.log(this.sendDate);
			await this.$http
				.post(`${repair}`+`/create`, {
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
