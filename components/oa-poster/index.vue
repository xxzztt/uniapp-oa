<template>
		<!-- 分享引导 -->
		<view
			class="popup"
			v-if="show && poster"
			@touchmove.stop.prevent="stopPrevent"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap.stop="hidePoster"></view>
			<view class="oa-poster"
				@longtap="handleImageSave"
			>
				<oa-image
					:preview="false"
					class="poster-img"
					:src="poster"></oa-image>
				<text class="tips" @touchstart.stop.prevent="() => {}">长按保存到相册</text>
				<!--#ifndef MP-->
				<view class="poster-close" @touchstart.stop="() => {}" @tap.stop="hidePoster">
					<text class="iconfont iconfork"></text>
				</view>
				<!--#endif-->
			</view>
		</view>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		poster: {
			type: String,
			default: ''
		}
	},
	methods: {
		stopPrevent() {
			this.$emit('hidePoster');
		},
		hidePoster() {
			this.$emit('hidePoster');
		},
		handleImageSave () {
			// #ifdef H5
			if (!this.$mPayment.isWechat()) this.$mHelper.toast('普通H5暂不支持保存二维码，请截图保存');
			// #endif
			// #ifndef H5
			uni.showModal({
				content: '是否保存海报到相册',
				success: confirmRes => {
					if (confirmRes.confirm) {
						this.saveImage();
					}
				}
			});
			// #endif
		},
		saveImage() {
			const _this = this;
			uni.saveImageToPhotosAlbum({
				filePath: this.poster,
				success() {
					_this.$mHelper.toast('保存成功');
				}
			});
		}
	}
};
</script>

<style lang="scss">
.oa-poster {
	position: fixed;
	z-index: 99;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin-top: 20upx;
	.poster-img {
		z-index: 999;
		display: inline-block;
		width: 600upx;
		border-radius: 12upx;
		height: 1000upx;
	}
	.poster-close {
		z-index: 100;
		padding: $spacing-base;
		position: absolute;
		top: -86upx;
		right: -68upx;
		.iconfork {
			font-size: 54upx;
			font-weight: 600;
			color: $color-white;
		}
	}
	.tips {
		color: $color-white;
		display: flex;
		margin-top: $spacing-lg;
		justify-content: center;
	}
}
</style>
