<template>
	<view class="page">
		<view class="input-title ">
			<text>审核状态</text>
			<template v-for="(works, index) in workState">
				<template v-if="works.key==getDetail.state">{{ works.value }}</template>
			</template>
		</view>
		<view class="input-title ">
			<text>申购分类</text>
			<template v-for="(cates, index) in workType">
				<template v-if="cates.key==getDetail.cate_id">{{ cates.value }}</template>
			</template>
		</view>
		<view class="input-title ">
			<text >数量</text>
			{{getDetail.num}}
		</view>
		<view class="input-title">
			<text>申领内容</text>
		</view>
		<view class="input-body">
			<textarea v-model="getDetail.content" class="input-textare" />
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
import { shop ,workState,getAssetType} from '@/api/basic';
import moment from '@/common/moment';

export default {
	data() {
		return {
			getDetail: {},
			approveDetail:{},
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
		this.getworksDetail(event.id);
		this.getworkState();
		this.getworkType();
	},
	methods: {
		// 获取详情
		async getworksDetail(id) {
			await this.$http
				.get(`${shop}`+'/view?id='+`${id}`)
				.then(r => {
					console.log(r.data);
					this.loading = false;
					this.getDetail = r.data.model;
					this.approveDetail = r.data.model.log;
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
				.get(`${getAssetType}`, {})
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
.tit {
			width: 80%;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
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

</style>
