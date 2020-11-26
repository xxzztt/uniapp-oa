<template>
	<view class="oa-notice-detail">
		<!-- <view class="feedback-title ">
			<text>审核状态</text>
			<template v-for="(works, index) in workState">
				<template v-if="works.key==worksDetail.state">{{ works.value }}</template>
			</template>
		</view>
 -->
		<!-- <view class="feedback-title">
			<text>申请理由</text>
		</view>
		<view class="feedback-body">
			<textarea v-model="worksDetail.content" class="feedback-textare" />
		</view> -->
		<view class="input-title">
			<text>{{worksDetail.content}}</text>
		</view>

		<view class="covers-title" v-if="imageList.length !== 0 ">
			<text>相关图片</text>
		</view>
		<view class="covers-body covers-uploader oa-uploader" v-if="imageList.length !== 0 ">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">点击预览图片</view>
					<view class="uni-uploader-info">{{ imageList.length }}/6</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image, index) in imageList" :key="index">
							<view class="uni-uploader__file" style="position: relative;">
								<oa-image class="uni-uploader__img" :src="image"></oa-image>
							</view>
						</block>
					</view>
				</view>
			</view>
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
		<view class="feedback-title">
			<text>问题和意见</text>
			<text class="feedback-quick" @tap="chooseMsg">快速键入 <text class="iconfont iconxia"></text></text>
		</view>
		<view class="feedback-body">
			<textarea placeholder="请详细描述您的意见..." v-model="sendDate.suggest" class="feedback-textare" />
			</view>
		<view class="footer">
			<view v-for="(item, index) in radioList" :key="index">
			<button class="action-btn" :class="'text-' + themeColor.name" @tap="handleWorksOperation(item.key)">
				{{item.value}}
			</button>
			</view>
		</view>
		<!--加载动画-->
	</view>
</template>

<script>
	import { worksDetail } from '@/api/userInfo';
	import { workState } from '@/api/basic';
	import moment from '@/common/moment';

	export default {
		data() {
			return {
				msgContents: [
					'同意',
					'不同意',
					'其他原因'
				],
				sendDate: {
					type: '1',
					suggest: '',
					contact_way: ''
				},
				workState: [],
				worksDetail: {},
				approveDetail:{},
				approveId:'',
				radioList:[],
				imageList:[],
				id: undefined,
				loading: true
			};
		},
		computed: {

		},
		filters: {
			// 时间格式化
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm');
			}
		},
		onLoad(event) {
			this.id = event.id;
			this.getWorksDetail(event.id);
			this.getworkState();
			// this.getworkType();
		},
		onShareAppMessage() {
			return {
				title: this.banner.title,
				path: `/pages/index/notice/detail?id=${this.id}`
			};
		},
		methods: {

			// 快速输入
			chooseMsg() {
				uni.showActionSheet({
					itemList: this.msgContents,
					success: res => {
						this.sendDate.suggest = this.msgContents[res.tapIndex];
					}
				});
			},

			// 获取详情
			async getWorksDetail(id) {
				await this.$http
					.get(`${worksDetail}`+'/view?id='+`${id}`)
					.then(r => {
						this.radioList = r.data.radioList;
						this.approveId = id;
						this.worksDetail = r.data.model;
						this.approveDetail = r.data.model.log;
						this.imageList = JSON.parse(r.data.model.covers);
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

			// 通过
			async handleWorksOperation(status) {
				// console.log(this.sendDate.suggest);
				await this.$http.put(`${worksDetail}`+'/update?id='+`${this.approveId}`, {status: status,suggest:this.sendDate.suggest}).then(() => {
					this.$mHelper.toast('操作成功');
					this.$mRouter.back();
				});
			},
		}
	};
</script>

<style lang="scss">
	.oa-notice-detail {
		.uni-timeline {
			padding: $spacing-lg;
			background-color: $color-white;
		}
		.feedback-title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: $spacing-base;
			margin-top: $spacing-base;
			font-size: $font-base;
		}

		.feedback-star-view.feedback-title {
			justify-content: flex-start;
			margin: 0;
		}

		.feedback-quick {
			position: relative;
			padding-right: 40upx;
			.iconfont {
				font-size: $font-sm;
			}
		}

		.feedback-body {
			background: $color-white;
			padding: $spacing-sm $spacing-base;
			.gender-item {
				margin-right: 20upx;

				.gender-item-text {
					padding-left: 10upx;
				}

				radio .wx-radio-input.wx-radio-input-checked {
					background: $uni-color-primary;
					border-color: $uni-color-primary;
				}
			}
		}

		.feedback-textare {
			height: 200upx;
			font-size: 34upx;
			line-height: 50upx;
			width: 100%;
			box-sizing: border-box;
			padding: 20upx 30upx 0;
		}
.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 98;
	width: 100%;
	background-color: $color-white;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 15upx $spacing-base;
	.action-btn {
		font-size: $font-sm;
		margin: 0 0 0 15upx;
		padding: 0 $spacing-lg;
		text-align: center;
		height: 60upx;
		line-height: 60upx;
	}
}
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
			padding: 20upx 40upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			color: gray;

			.article-text {
				font-size: 26upx;
				line-height: 50upx;
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
		.covers-title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: $spacing-base;
			margin-top: $spacing-base;
			font-size: $font-base;

		}
		.covers-body {
			background: $color-white;
			padding: $spacing-sm $spacing-base;
			.gender-item {
				margin-right: 20upx;

				.gender-item-text {
					padding-left: 10upx;
				}

				radio .wx-radio-input.wx-radio-input-checked {
					background: $uni-color-primary;
					border-color: $uni-color-primary;
				}
			}
		}
		.covers-uploader {
			padding: 22upx 20upx;
		}
	}
</style>
