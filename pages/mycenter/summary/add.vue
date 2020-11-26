<template>
	<view class="page">
		<!-- <view class="input-t" @tap.stop="chooseType">
			<text>类型</text>
			<text class="input-quick">{{ mtype || '请选择总结类型' }} <text class="iconfont iconxia"></text></text>
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
			<text>标题</text>
			<input class="input tit" type="text" v-model="sendDate.title" placeholder="请输入总结标题" placeholder-class="placeholder" />
		</view>

		<view class="input-t">
			<text>内容</text>
		</view>
		<view class="input-body">
			<textarea placeholder="请详细描述您的总结内容..." v-model="sendDate.content" class="input-textare" />
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
import { summary,getSummaryType } from '@/api/basic';
import moment from '@/common/moment';
export default {
	data() {
		return {
			// mtype:'',
			// mtypeValue:'',
			type: [],
			typeindex: 0,
			sendDate: {},
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
		bindTypeChange(e) {
			this.typeindex = e.target.value
		},
		async getworksType() {
			await this.$http
				.get(`${getSummaryType}`, {})
				.then(r => {
					this.type = r.data;
				})
		},
		// chooseType() {
		// 	uni.showActionSheet({
		// 		itemList: this.worksType,
		// 		success: res => {
		// 			this.mtype = this.worksType[res.tapIndex];
		// 			this.mtypeValue = res.tapIndex;
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
			await this.$http
				.post(`${summary}`+`/create`, {
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
	height: 600upx;
	font-size: 34upx;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx 30upx 0;
}

</style>
