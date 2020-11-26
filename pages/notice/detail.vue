<template>
	<view class="oa-notice-detail">

		<view class="article-meta" v-if="announceDetail.created_at">
			<text class="article-author">{{ companyName || appName }}</text>
			<text class="article-text">发布于</text>
			<text class="article-time">{{ announceDetail.created_at | time }}</text>
		</view>
		<view class="article-content">
			<oa-parser lazy-load :html="announceDetail.content"></oa-parser>
		</view>
		<oa-empty
			info="暂无详情"
			v-if="!announceDetail && !loading"
		></oa-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import { notifyAnnounce } from '@/api/basic';
import moment from '@/common/moment';
import oaParser from '@/components/oa-parser';
export default {
	components: {
		oaParser,
	},
	data() {
		return {
			announceDetail: {},
			appName: this.$mSettingConfig.appName,
			companyName:uni.getStorageSync('userInfo').merchant.title,
			id: undefined,
			loading: true
		};
	},
	filters: {
		// 时间格式化
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		}
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
	onLoad(event) {
		// console.log(uni.getStorageSync('userInfo').merchant.company_name);
		this.id = event.id;
		this.getNotifyAnnounceView(event.id);
	},
	onShareAppMessage() {
		return {
			title: this.banner.title,
			path: `/pages/index/notice/detail?id=${this.id}`
		};
	},
	methods: {
		// 获取通知列表
		async getNotifyAnnounceView(id) {
			await this.$http
				.get(`${notifyAnnounce}`+'/view?id='+`${id}`)
				.then(r => {
					this.loading = false;
					this.announceDetail = r.data;
					uni.setNavigationBarTitle({
						title: r.data.title
					});
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>

<style lang="scss">
.oa-notice-detail {
	.banner {
		overflow: hidden;
		position: relative;
		background-color: #ccc;
		.banner-img {
			height: 300upx;
			width: 100%;
		}
		.banner-title {
			max-height: 84upx;
			overflow: hidden;
			position: absolute;
			bottom: 0;
			width: 100%;
			font-size: 32upx;
			font-weight: 400;
			line-height: 42upx;
			color: white;
			z-index: 11;
			background-color: rgba(0, 0, 0, 0.25);
			padding: 4upx 20upx;
		}
	}
	.banner-title {
		padding: $spacing-lg $spacing-lg 0;
		font-size: $font-lg;
	}
	.article-meta {
		padding: 20upx 30upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;

		.article-text {
			font-size: 30upx;
			margin: 0 20upx;
		}

		.article-author,
		.article-time {
			font-size: 30upx;
		}
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 30upx;
		margin-bottom: 30upx;
	}
}
</style>
