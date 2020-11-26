<template>
	<view class="page">
		<!-- <view class="input-t" @tap.stop="chooseType">
			<text>类型</text>
			<text class="input-quick">{{ type || '请选择日程类型' }} <text class="iconfont iconxia"></text></text>
		</view> -->
		<view class="input-t ">
			<text>类型</text>
			<view class="tit">
				<picker @change="bindTypeChange" :value="typeindex" :range="type">
					<view class="uni-input">{{type[typeindex]}}</view>
				</picker>
			</view>
		</view>
		<view class="input-t ">
			<text>地点</text>
			<input class="input tit" type="text" v-model="sendDate.address" placeholder="请输入地点" placeholder-class="placeholder" />
		</view>
		<view class="input-t " v-if="this.typeindex === 1">
			<text>参与人</text>
			<input class="input tit" type="text" v-model="sendDate.attend" placeholder="请输入参与人的手机号;用英文,号隔开" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>开始时间</text>
			<picker mode="date" v-model="sendDate.begin_date" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					begin_date || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="input-t ">
			<text>结束时间</text>
			<picker mode="date" v-model="sendDate.end_date" @change="bindEndDateChange">
				<view class="date" style="background: none;">{{
					end_date || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="input-t">
			<text>描述</text>
		</view>
		<view class="input-body">
			<textarea placeholder="请详细描述您的日志内容..." v-model="sendDate.content" class="input-textare" />
			</view>
			<view class="input-t" v-if="this.typeindex === 1">
				<text>提醒方式</text>
			</view>
			<view class="input-body" v-if="this.typeindex === 1">
				<radio-group @change="handleRemindTypeChange">
					<label
						class="gender-item"
						v-for="(item, index) in remind"
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
			确定提交
		</button>

	</view>
</template>

<script>
import { calendar,getCalendarType } from '@/api/basic';
import moment from '@/common/moment';
export default {
	data() {
		return {
			type: [],
			typeindex: 0,
			remind: [{value: '0',name: '不提醒'},{value: '1',name: '消息提醒'},{value: '2',name: '短信提醒'}],
			sendDate: {
				remind:'0',
				content: '',
			},
			begin_date: moment().format('YYYY-MM-DD'),
			end_date: moment().format('YYYY-MM-DD'),
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
		// 监听日期更改
		bindDateChange(e) {
			this.begin_date = e.target.value;
		},
		bindEndDateChange(e) {
			this.end_date = e.target.value;
		},
		bindTypeChange(e) {
			this.typeindex = e.target.value
		},
		async getworksType() {
			await this.$http
				.get(`${getCalendarType}`, {})
				.then(r => {
					this.type = r.data;
				})
		},
		// chooseType() {
		// 	uni.showActionSheet({
		// 		itemList: this.worksType,
		// 		success: res => {
		// 			this.type = this.worksType[res.tapIndex];
		// 			this.typeValue = res.tapIndex;
		// 		},
		// 		fail: res => {
		// 			console.log(res);
		// 		}
		// 	});
		// },
		// 发送数据
		async send() {
			this.btnLoading = true;
			this.sendDate.type = this.typeindex;
			this.sendDate.begin_date = this.begin_date;
			this.sendDate.end_date = this.end_date;
			// console.log(this.sendDate);
			await this.$http
				.post(`${calendar}`+`/create`, {
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
