<template>
	<view class="about" v-if="!loading">
		<view class="shop-info " v-if="title === '关于我们'">
			<view class="about-content" v-if="detail.about_me">
				<oa-parser lazy-load :html="detail.about_me"></oa-parser>
			</view>
			<oa-empty :info="`暂无${title}`" v-if="!detail.about_me && !loading"></oa-empty>
		</view>
		<view class="shop-info " v-if="title === '注册协议'">
			<view class="about-content" v-if="detail.protocol_register">
				<oa-parser lazy-load :html="detail.protocol_register"></oa-parser>
			</view>
			<oa-empty :info="`暂无${title}`" v-if="!detail.protocol_register && !loading"></oa-empty>
		</view>
		<view class="shop-info" v-if="title === '隐私协议'">
			<view class="about-content" v-if="detail.protocol_privacy">
				<oa-parser lazy-load :html="detail.protocol_privacy"></oa-parser>
			</view>
			<oa-empty :info="`暂无${title}`" v-if="!detail.protocol_privacy && !loading"></oa-empty>
		</view>

		<oa-empty :info="`暂无${title}`" v-if="!detail && !loading"></oa-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	/**
	 * @des 关于商城详情
	 *
	 * @author hjp1011 21931118@qq.com
	 * @date 2019-12-09 10:13
	 * @copyright 2019
	 */
	import {
		configList
	} from '@/api/basic';
	import {
		merchantView
	} from '@/api/merchant';
	import oaParser from '@/components/oa-parser';
	
	export default {
		components: {
			oaParser
		},
		data() {
			return {
				detail: {},
				title: null,
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
			this.initData(options);
		},
		methods: {
			// 数据初始化
			initData(options) {
				this.title = options.title;
				uni.setNavigationBarTitle({
					title: options.title
				});
				this.getConfigList(options.field);
			},
			// 获取设置详情
			async getConfigList(field) {
				await this.$http
					.get(`${configList}`, {
						field
					})
					.then(r => {
						this.loading = false;
						this.detail = r.data;
					})
					.catch(() => {
						this.loading = false;
					});

			}
		}
	};
</script>
<style lang="scss">
	page {
		background-color: $page-color-base;
		position: relative;

		.about {
			.shop-info {
				.about-content {
					padding: $spacing-lg;
				}

				text-align: left;

				image {
					margin-top: 100upx;
					width: 240upx;
					height: 240upx;
					border-radius: 50%;
				}
			}
		}
	}
</style>
