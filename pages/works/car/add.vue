<template>
	<view class="page">
		<view class="input-t">
			<text>申请车辆</text>
			<text class="input-quick">{{ car.title || '请选择车辆' }}</text>
		</view>
		<view class="input-t ">
			<text>用车时间</text>
			<picker mode="date" v-model="sendDate.begin_date" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					begin_date || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="input-t ">
			<text>返回时间</text>
			<picker mode="date" v-model="sendDate.end_date" @change="bindEndDateChange">
				<view class="date" style="background: none;">{{
					end_date || '请选择日期'
				}}</view>
			</picker>
		</view>
		<view class="input-t ">
			<text>目的地</text>
			<input class="input tit" type="text" v-model="sendDate.destination" placeholder="请输入目的地" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>同行人员</text>
			<input class="input tit" type="text" v-model="sendDate.passengers" placeholder="请输入姓名,多个用逗号隔开" placeholder-class="placeholder" />
		</view>
		<view class="input-t">
			<text>用车原因</text>

		</view>
		<view class="input-body">
			<textarea placeholder="请详细描述您要用车的原因..." v-model="sendDate.content" class="input-textare" />
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
import { car, carApply,carMsg,getCar } from '@/api/basic';
import moment from '@/common/moment';
export default {
	data() {
		return {
			car_id:undefined,
			car:{},
			remindType: [{value: '0',name: '不提醒'},{value: '1',name: '消息提醒'},{value: '2',name: '短信提醒'}],
			sendDate: {
				remind:'0',
				content: '',
				destination:'',
				passengers:'',

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
		this.car_id = options.id;
		await this.getCar(this.car_id);
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
		async getCar(id) {
			await this.$http
				.get(`${car}`+'/view?id='+`${id}`, {})
				.then(r => {
						this.car = r.data;
				})
				.catch(() => {
					this.loading = false;

				});
		},


		// 发送数据
		async send() {
			this.btnLoading = true;
			// this.sendDate.type = this.mtype;
			this.sendDate.car_id = this.car_id;
			this.sendDate.status = 'car/apply';
			this.sendDate.begin_date = this.begin_date;
			this.sendDate.end_date = this.end_date;
			// console.log(this.sendDate);
			await this.$http
				.post(`${carApply}`+`/create`, {
					...this.sendDate
				})
				.then(() => {
					this.btnLoading = false;
					this.$mRouter.push({
						route: `/pages/works/car/index`
					});
					// this.$mRouter.back();
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
	// padding-right: 40upx;
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
