<template>
	<view class="page">
		<view class="cu-form-group">
			<view >就餐类型</view>
				<radio-group  @change="handleTypeChange">
					<label class="radio margin-right" v-for="(item, index) in diningType" :key="index"><radio :value="item.key"
						:checked="item.key === type" :color="themeColor.color"  style="transform: scale(0.75);"/>{{ item.value }}</label>
				</radio-group>
		</view>
		<view class="input-t ">
			<text>就餐人数</text>
			<input class="input tit" type="text" v-model="sendDate.num" placeholder="请输入就餐人数" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>就餐时间</text>
			<picker mode="date" v-model="sendDate.date" @change="bindDateChange">
				<view class="date" style="background: none;">{{
					date || '请选择日期'
				}}</view>
			</picker>
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
import { uploadImage } from '@/api/userInfo';
import { dining,diningType } from '@/api/basic';
import moment from '@/common/moment';
export default {
	data() {
		return {
			type:0,
			date: moment().format('YYYY-MM-DD'),
			diningType:[],
			sendDate:{},
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
		await this.getDiningType();
		this.id = options.id;
		this.getDetail(this.id);
	},
	methods: {
		// 监听反馈类型事件
		handleTypeChange(e) {
			this.type = e.detail.value;
		},
		// 监听日期更改
		bindDateChange(e) {
				this.date = e.target.value;
		},
		async getDiningType() {
			await this.$http
				.get(`${diningType}`, {})
				.then(r => {
					this.diningType = r.data;
				})
		},
		// 获取详情
			async getDetail(id) {
				await this.$http
					.get(`${dining}`+'/view?id='+`${id}`)
					.then(r => {
						this.loading = false;
						this.sendDate = r.data;
						this.typeindex = r.data.type;
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
			this.sendDate.type = this.type;
			this.sendDate.date = this.date;
			console.log(this.sendDate.date);
			await this.$http
					.put(`${dining}/update?id=${this.id}`, {
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
