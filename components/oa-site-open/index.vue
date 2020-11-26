<template>
	<view class="versionUpgrade" @touchmove.stop.prevent="discard" v-if="!isOpenSite">
		<view class="upgrade-wrapper">
			<view class="oa-version-upgrade" :class="'bg-' + themeColor.name" @tap.stop="discard">
				<image :src="openSiteBg"></image>
				<view class="upgrade-top-content">
					<view>{{ closeSiteExplain }}</view>
					<view class="upgrade-time">{{ closeSiteDate }}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
/* eslint-disable */
export default {
	name: 'oa-version-upgrade',
	data() {
		return {
			openSiteBg: this.$mAssetsPath.openSiteBg,
			isOpenSite: this.$mSettingConfig.isOpenSite,
			closeSiteExplain: this.$mSettingConfig.closeSiteExplain,
			closeSiteDate: this.$mSettingConfig.closeSiteDate
		};
	},
	created() {
	},
	computed: {
	},
	methods: {
		discard () {}
	}
};
</script>
<style lang="scss" scoped>
.versionUpgrade {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999999;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
}
.upgrade-wrapper {
	width: 500upx;
	height: 600upx;
}
.oa-version-upgrade {
	z-index: 9999999;
	margin-top: -60upx;
	width: 100%;
	height: 600upx;
	border-radius: 12upx;
	display: flex;
	justify-content: center;
	position: relative;
	image {
		position: absolute;
		top: -150upx;
		width: 100%;
		height: 800upx;
		border-radius: 12upx;
	}
	.upgrade-top-content {
		font-weight: 500;
		margin-top: 360upx;
		text-align: center;
		color: $font-color-dark;
		z-index: 100;
		font-size: $font-lg + 2upx;
		.upgrade-time {
			margin-top: $spacing-lg;
			font-size: $font-base;
			color: $font-color-light;
		}
	}
}
</style>
