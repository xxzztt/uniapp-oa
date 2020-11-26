<template>
	<view>
		<view
			class="oa-top-dropdown oa-dropdown-box"
			:class="[show ? 'oa-dropdown-show' : '']"
			:style="{
				height: height ? px(height) : 'auto',
				background: bgcolor,
				paddingBottom: px(paddingbtm),
				transform:
					'translateZ(0) translateY(' + (show ? px(translatey) : '-100%') + ')'
			}"
		>
			<slot></slot>
		</view>
		<view
			class="oa-dropdown-mask"
			:class="[mask && show ? 'oa-mask-show' : '']"
			@tap="handleClose"
		></view>
	</view>
</template>

<script>
export default {
	name: 'tuiTopDropdown',
	props: {
		// 是否需要mask
		mask: {
			type: Boolean,
			default: true
		},
		// 控制显示
		show: {
			type: Boolean,
			default: false
		},
		// 背景颜色
		bgcolor: {
			type: String,
			default: '#f2f2f2'
		},
		// padding-bottom  rpx
		paddingbtm: {
			type: Number,
			default: 0
		},
		// 高度 upx
		height: {
			type: Number,
			default: 580
		},
		// 移动距离 需要计算
		translatey: {
			type: Number,
			default: 0
		}
	},
	methods: {
		handleClose() {
			if (!this.show) {
				return;
			}
			this.$emit('close', {});
		},
		px(num) {
			return uni.upx2px(num) + 'px';
		}
	}
};
</script>

<style>
.oa-dropdown-box {
	width: 100%;
	position: fixed;
	box-sizing: border-box;
	border-bottom-right-radius: 24upx;
	border-bottom-left-radius: 24upx;
	transform: translateZ(0);
	overflow: hidden;
	visibility: hidden;
	transition: all 0.3s ease-in-out;
	z-index: 99;
	top: 0;
}
.oa-dropdown-show {
	visibility: visible;
}
.oa-dropdown-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 98;
	transition: all 0.3s ease-in-out;
	opacity: 0;
	visibility: hidden;
}
.oa-mask-show {
	opacity: 1;
	visibility: visible;
}
</style>
