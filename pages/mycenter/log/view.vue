<template>
	<view class="page">
		<br>
		<view class="article-content">
			<oa-parser lazy-load :html="detail.content"></oa-parser>
		</view>

	</view>
</template>
<script>
import { log ,logType} from '@/api/basic';
import moment from '@/common/moment';

export default {
	data() {
		return {
			detail: {},
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
		this.getDetail(event.id);
		this.getworkType();
	},
	methods: {
		// 获取详情
		async getDetail(id) {
			await this.$http
				.get(`${log}`+'/view?id='+`${id}`)
				.then(r => {
					this.loading = false;
					this.detail = r.data;
					uni.setNavigationBarTitle({
						title: r.data.title
					});
				})
				.catch(() => {
					this.loading = false;
				});
		},

		//获取类型
		async getworkType() {
			await this.$http
				.get(`${logType}`, {})
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
.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 30upx;
		margin-bottom: 30upx;
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
