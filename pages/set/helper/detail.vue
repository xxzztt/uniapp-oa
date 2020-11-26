<template>
	<view class="helper-detail" v-if="!loading">
		<view v-if="helperDetail.title" class="detail">
			<oa-parser lazy-load :html="helperDetail.content || ''"></oa-parser>
		</view>
		<oa-empty :info="`暂无帮助内容`" v-if="!helperDetail.title && !loading"></oa-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import { helperView } from '@/api/basic';
import oaParser from '@/components/oa-parser';
export default {
	components: {
		oaParser,
	},
	data() {
		return {
			loading: true,
			helperDetail: {},
			helperId: ''
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
	onLoad(option) {
		this.helperId = option.id;
		this.initData();
	},
	methods: {
		// 数据初始化
		initData() {
			this.getHelperDetail();
		},
		async getHelperDetail() {
			await this.$http.get(helperView, {
				id: this.helperId
			}).then(r => {
				this.loading = false;
				this.helperDetail = r.data;
				uni.setNavigationBarTitle({ title: r.data.title });
			}).catch(() => {
				this.loading = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: $page-color-base;
}
.helper-detail {
	.detail {
		text-align: left;
		padding: $spacing-base $spacing-base;
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			padding: $spacing-base 0;
		}
	}
}
</style>
