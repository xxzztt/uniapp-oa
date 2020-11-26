<template>
	<view class="page">
		<view class="input-title ">
			<text>审核状态</text>
			<template v-for="(works, index) in workState">
				<template v-if="works.key==detail.state">{{ works.value }}</template>
			</template>
		</view>
		<view class="input-title ">
			<text>报销分类</text>
			<template v-for="(cates, index) in workType">
				<template v-if="cates.key==detail.cate_id">{{ cates.value }}</template>
			</template>
		</view>
		<view class="input-title ">
			<text>报销金额</text>
			¥{{detail.amount}}元
		</view>
		<view class="input-title">
			<text>报销内容</text>
		</view>
		<view class="input-body">
			<textarea v-model="detail.content" class="input-textare" />
		</view>

		<view class="covers-title" v-if="imageList.length !== 0 ">
			<text>报销凭证</text>
		</view>
		<view class="covers-body covers-uploader oa-uploader" v-if="imageList.length !== 0 ">
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
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-timeline">
			<view class="uni-timeline-item" :class="[
						index === 0 ? `text-${themeColor.name} uni-timeline-first-item` : '',
						index === approveDetail.length - 1 ? 'uni-timeline-last-item' : ''
					]"
			 v-for="(item, index) in approveDetail" :key="index">
				<view class="uni-timeline-item-divider"></view>
				<view class="uni-timeline-item-content">
					<view>
						{{ item.approve }}
					</view>
					<view class="datetime">
						{{item.name}} {{ item.suggest }} {{ item.time | time }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { expense ,workState,getExpenseType} from '@/api/basic';
import moment from '@/common/moment';

export default {
	data() {
		return {
			detail: {},
			approveDetail:{},
			imageList: [],
			workState: [],
			workType: [],
			id: undefined,
			loading: true
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
	filters: {
		// 时间格式化
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		}
	},
	onLoad(event) {
		this.id = event.id;
		this.getdetail(event.id);
		this.getworkState();
		this.getworkType();
	},
	methods: {
		// 获取详情
		async getdetail(id) {
			await this.$http
				.get(`${expense}`+'/view?id='+`${id}`)
				.then(r => {
					this.loading = false;
					this.detail = r.data.model;
					this.approveDetail = r.data.model.log;
					this.imageList = JSON.parse(r.data.model.covers);
					uni.setNavigationBarTitle({
						title: r.data.title
					});
				})
				.catch(() => {
					this.loading = false;
				});
		},
		//获取状态
		async getworkState() {
			await this.$http
				.get(`${workState}`, {})
				.then(r => {
					this.workState = r.data;
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		//获取类型
		async getworkType() {
			await this.$http
				.get(`${getExpenseType}`, {})
				.then(r => {
					this.workType = r.data;
				})
				.catch(() => {
					this.loading = false;
					if (mtype === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.uni-timeline {
			padding: $spacing-lg;
			background-color: $color-white;
		}
/*问题反馈*/
.input-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: $spacing-base;
	margin-top: $spacing-base;
	font-size: $font-base;

}

.input-body {
	background: $color-white;
	padding: $spacing-sm $spacing-base;
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
