<template>
	<view class="page">
		<view class="input-title ">
			<text>审核状态</text>
			<template v-for="(works, index) in workState">
				<template v-if="works.key==detail.state">{{ works.value }}</template>
			</template>
		</view>
		<view class="input-title">
			<text>出差理由</text>
		</view>
		<view class="input-body">
			<textarea v-model="detail.content" class="input-textare" />
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
import { trip ,workState} from '@/api/basic';
import moment from '@/common/moment';

export default {
	data() {
		return {
			detail: {},
			approveDetail:{},
			imageList: [],
			workState: [],
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
		this.getDetail(event.id);
		this.getworkState();
	},
	methods: {
		// 获取详情
		async getDetail(id) {
			await this.$http
				.get(`${trip}`+'/view?id='+`${id}`)
				.then(r => {
					this.loading = false;
					this.detail = r.data.model;
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

</style>
