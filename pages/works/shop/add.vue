<template>
	<view class="page">
		<view class="input-t">
			<text>申购资产</text>
			<text class="input-quick">{{ asset.title  || '请选择要申购的资产' }}</text>
		</view>
		<view class="input-t ">
			<text >数量</text>
			<input
				class="input tit"
				type="text"
				v-model="sendDate.num"
				placeholder="请输入整数"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="input-t">
			<text>申购原因</text>
			<text class="input-quick"></text>
		</view>
		<view class="input-body">
			<textarea
				placeholder="请详细描述您要申购的原因..."
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
import { shop,asset } from '@/api/basic';
export default {
	data() {
		return {
			type:'',
			asset_id:undefined,
			asset:[],
			remindType: [{value: '0',name: '不提醒'},{value: '1',name: '消息提醒'},{value: '2',name: '短信提醒'}],
			sendDate: {
				remind:'0',
				content: ''
			},
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
		this.asset_id = options.id;
		await this.getAsset(this.asset_id);
	},
	methods: {
		// 监听反馈类型事件
		handleRemindTypeChange(e) {
			this.sendDate.remind = e.detail.value;
		},
		async getAsset(id) {
			await this.$http
				.get(`${asset}`+'/view?id='+`${id}`, {})
				.then(r => {
						this.asset = r.data;
				})
				.catch(() => {
					this.loading = false;

				});
		},
		// 发送数据
		async send() {
			this.btnLoading = true;
			// this.sendDate.type = this.mtype;
			this.sendDate.asset_id = this.asset_id;
			this.sendDate.status = 'shop/apply';
			// console.log(this.sendDate);
			await this.$http
				.post(`${shop}`+`/create`, {
					...this.sendDate
				})
				.then(() => {
					this.btnLoading = false;
					this.$mRouter.push({
						route: `/pages/works/shop/index`
					});
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
