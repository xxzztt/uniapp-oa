<template>
	<view class="service-detail" v-if="!loading">
		<view class="question" v-if="questionDetail">
			Q: {{ questionDetail.title }}
		</view>
		<view class="answer" v-if="questionDetail">
			A:
			<oa-parser lazy-load :html="questionDetail.content"></oa-parser>
		</view>
		<!-- <rfRecommend :list="[]"></rfRecommend> -->
	</view>
</template>

<script>
/**
 *@des 问题详情
 *@author stav stavyan@qq.com
 *@blog https://stavtop.club
 *@date 2020/03/29 20:40:46
 */

import { questionsView } from '@/api/websocket';
import rfRecommend from '@/components/oa-recommend/oa-recommend';
import oaParser from '@/components/oa-parser';
export default {
	components: { rfRecommend,oaParser },
	data() {
		return {
			questionDetail: {},
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
	onLoad(options) {
		this.questionDetail = {};
		this.getQuestionsView(options.id);
	},
	methods: {
		async getQuestionsView(id) {
			await this.$http
				.get(`${questionsView}`, {
					id
				})
				.then(r => {
					this.loading = false;
					this.questionDetail = r.data;
				});
		},
		navTo(route) {
			this.$mRouter.push({ route });
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: $color-white;
}
.service-detail {
	margin-top: 40upx;
	font-size: $font-base;
	.question,
	.answer {
		margin: 20upx 30upx;
	}
	.answer-content {
		display: inline-block;
		margin-left: 6upx;
	}
}
</style>
