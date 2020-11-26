<template>
	<view class="service-index">
		<view class="header">
			<view class="service-item" @tap="navTo(`/pages/service/service`)">
				<text class="iconfont iconxiaoxi" :class="'text-' + themeColor.name"></text>
				<text>联系客服</text>
				<text class="time">{{
					serviceConfig.config.service_working_hours
				}}</text>
			</view>
			<view class="service-item" @tap="navTo('call')">
				<text class="iconfont icondianhua-copy" :class="'text-' + themeColor.name"></text>
				<text>专属热线</text>
				<text class="time">{{
					serviceConfig.config.service_on_line_working_hours
				}}</text>
			</view>
		</view>
		<view class="title">常见问题</view>
		<view
			class="list-cell b-b"
			v-for="(item, index) in serviceConfig.questions"
			:key="index"
			@tap="navTo(`/pages/service/detail?id=${item.id}`)"
			hover-class="cell-hover"
			:hover-stay-time="50"
		>
			<text class="cell-tit">{{ `${index + 1}. ${item.title}` }}</text>
			<text class="cell-more iconfont iconyou"></text>
		</view>
		<oa-empty
			:info="'暂无常见问题'"
			v-if="serviceConfig.questions.length === 0 && !loading"
		></oa-empty>
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 *@des 客服入口页
 *@author stav stavyan@qq.com
 *@blog https://stavtop.club
 *@date 2020/03/29 20:40:46
 */

import { questionsIndex } from '@/api/websocket';

export default {
	data() {
		return {
			serviceConfig: {
				config: {},
				questions: []
			},
			isStuffService: false,
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
	onLoad() {
		this.getQuestionsIndex();
	},
	methods: {
		async getQuestionsIndex() {
			this.loading = true;
			await this.$http
				.get(`${questionsIndex}`, {})
				.then(r => {
					this.loading = false;
					this.serviceConfig = r.data;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		navTo(route) {
			if (route === 'call') {
				if (!this.serviceConfig.config.service_mobile) {
          this.$mHelper.toast('还未配置热线电话哦');
          return;
				}
				uni.makePhoneCall({
					phoneNumber: this.serviceConfig.config.service_mobile
				});
				return;
			}
			this.$mRouter.push({ route });
		}
	}
};
</script>
<style lang="scss" scoped>
page {
	background-color: $color-white;
}
.service-index {
	background-color: $color-white;
	/*  #ifndef H5  */
	height: 100vh;
	/*  #endif  */
	.header {
		display: flex;
		justify-content: space-between;
		text-align: center;
		padding: 60upx 120upx;
		.service-item {
			line-height: 1.5;
			.iconfont {
				display: block;
				font-size: $font-lg + 40upx;
			}
			.time {
				display: block;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}
	.title {
		height: 80upx;
		background-color: $page-color-base;
		line-height: 80upx;
		padding-left: $spacing-base;
	}
}
</style>
