<template>
	<view class="chat">
		<view class="service">
			<view
				class="wrapper"
				:class="popupLayerClass"
				:style="{ bottom: bottomHeight }"
			>
				<view class="margin-top-sm">
					<view class="cu-chat" v-for="(item, index) in imHistory" :key="index">
						<view class="cu-info round" v-if="item.tip">{{ item.content }}</view>
						<view class="cu-item self" v-if="item.user_type == 'member'">
							<view class="main">
								<view class="content bg-green shadow dz-inline-100">
									<rich-text :nodes="item.content"></rich-text>
								</view>
							</view>
							<view class="cu-avatar radius" :style="item.avatar || `background-image:url(${item.member.head_portrait})`"></view>
							<view class="date">{{ item.created_at | time }}</view>
						</view>
						<view class="cu-item" v-if="item.user_type == 'service'">
							<view class="cu-avatar radius" :style="item.avatar || `background-image:url(${item.member.head_portrait})`"></view>
							<view class="name dz-inline-1">
								{{ item.serviceNickname || item.realname }}
							</view>
							<view class="main service">
								<view class="content shadow">
									<rich-text :nodes="item.content"></rich-text>
								</view>
							</view>
							<view class="date "> {{ item.created_at | time }}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部输入栏 -->
			<view
				class="input-box"
				:class="popupLayerClass"
				@touchmove.stop.prevent="discard"
			>
				<view class="more" @tap="showMore">
					<text v-if="isStuffService" class="cuIcon-roundadd text-grey"></text>
					<view class="service" v-else @tap.stop="swiftStuffService">
						<text class="iconfont iconkefu2"></text>
						<text>转人工</text>
					</view>
				</view>
				<view class="textbox">
					<view
						class="voice-mode"
						:class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
						>{{ voiceTis }}
					</view>
					<view class="text-mode" :class="isVoice ? 'hidden' : ''">
						<view class="box">
							<textarea
								auto-height="true"
								v-model="textMsg"
								@focus="textareaFocus"
							/>
						</view>
						<view class="em" @tap="chooseEmoji">
							<text class="cuIcon-emojifill text-grey"></text>
						</view>
					</view>
				</view>
				<view class="send" :class="isVoice ? 'hidden ' : 'bg-' + themeColor.name" @tap="sendText">
					<view class="btn">发送</view>
				</view>
			</view>
			<!-- 抽屉栏 -->
			<view
				class="popup-layer"
				:class="popupLayerClass"
				@touchmove.stop.prevent="discard"
			>
				<oa-emoji
					style="height: 100%;"
					@emotion="addEmoji"
					:class="{ hidden: hideEmoji }"
				></oa-emoji>
				<!-- 更多功能 相册-拍照 -->
				<view class="more-layer" :class="{ hidden: hideMore }">
					<view class="list">
						<view class="box" @tap="chooseImage">
							<text class="iconfont icontupian"></text>
						</view>
						<view class="box" @tap="camera">
							<text class="iconfont iconxiangji1"></text>
						</view>
<!-- 						<view class="box" @tap="getAddress">
							<text class="cuIcon-locationfill icon"></text>
						</view> -->
						<view class="box" @tap="clearChatList">
							<text class="iconfont iconshanchu"></text>
						</view>
						<view class="box" @tap="endSession">
							<text class="iconfont iconjieshuketang"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
/* eslint-disable */
import rfEmoji from '@/components/oa-emoji/oa-emoji';
import moment from '@/common/moment';

import { mapState,mapMutations,mapGetters } from 'vuex'
import { uploadImage } from '@/api/userInfo';
export default {
	components: {
		rfEmoji
	},
	data() {
		return {
			bottomHeight: 0,
			textMsg: '',
			// 消息列表
			scrollTop: 0,
			isVoice: false,
			voiceTis: '按住 说话',
			recording: false,
			// 播放语音相关参数
			// 抽屉参数
			popupLayerClass: '',
			// more参数
			hideMore: true,
			// 表情定义
			hideEmoji: true,
			chatList: []
		};
	},
	computed:{
		...mapState(['accessToken','userInfo','imHistory','isImPanel','imNoRead','isStuffService']),
		...mapGetters(['hasLogin'])
	},
	watch:{
		'$store.state.imHistory': function () {
		    this.scrollToBottom()
		},
		'$store.state.isStuffService': function (val) {
		    if(val){
				uni.setNavigationBarTitle({
				    title: '人工客服'
				});
			}else{
				uni.setNavigationBarTitle({
				    title: '机器人客服'
				});
			}
		}
	},
	mounted() {
		this.scrollToBottom()
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
		this.setIsImPanel(true)
		if(!this.$mWebsocket.conncted){
			let params = {
				tip: true,
				content: '连接客服服务失败，正在重新连接...'
			};
			this.addImHistory(params)
		}else{
			if(!this.isStuffService){
				let params = {
					tip: true,
					content: '当前由机器人精灵为您服务'
				};
				this.addImHistory(params)
			}
		}
		if(this.isStuffService){
			uni.setNavigationBarTitle({
			    title: '人工客服'
			});
		}else{
			uni.setNavigationBarTitle({
			    title: '机器人客服'
			});
		}
	},
	onUnload() {
		this.setIsImPanel(false)
	},
	filters: {
		// 时间格式化
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		}
	},
	methods: {
		...mapMutations(['addImHistory','addImNoRead','setIsImPanel','setIsStuffService','clearImHistory']),
		// 选择图片发送
		chooseImage() {
			this.getImage('album');
		},
		// 拍照发送
		camera() {
			this.getImage('camera');
		},
		// 选照片 or 拍照
		getImage(type) {
			const _this = this;
			this.hideDrawer();
			uni.chooseImage({
				sourceType: [type],
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				success: res => {
					_this.handleUploadFile(res.tempFilePaths);
				}
			});
		},
		// 图片上传
		handleUploadFile(data) {
			data.forEach(item => {
				this.$http
				.upload(uploadImage, { filePath: item, name: 'file' })
					.then(r => {
						this.sendMessage(r.data.url, 'image');
					});
			});
		},
		// 更多功能(点击+弹出)
		showMore() {
			this.isVoice = false;
			this.hideEmoji = true;
			if (this.hideMore) {
				this.bottomHeight = '500upx';
				this.hideMore = false;
				this.openDrawer();
			} else {
				this.bottomHeight = 0;
				this.hideDrawer();
			}
		},
		swiftStuffService() {
			let params = {
				tip: true,
				content: '正在为您转接人工服务，请稍候...'
			};
			this.addImHistory(params)
			this.$mWebsocket.send(
				JSON.stringify({ route: this.$mWebsocketConfig.queueUpMatching })
			);
		},
		// 发送文字消息
		sendText() {
			this.hideDrawer(); // 隐藏抽屉
			if (!this.textMsg) {
				return;
			}
			this.sendMessage(this.textMsg, 'text');
			this.textMsg = ''; // 清空输入框
		},
		// 获取焦点，如果不是选表情ing,则关闭抽屉
		textareaFocus() {
			if (this.popupLayerClass === 'showLayer' && this.hideMore === false) {
				this.hideDrawer();
			}
		},
		// 添加表情
		addEmoji(em) {
			this.textMsg += `${this.emojiToText(em)}`;
		},
		// 表情转文字
		emojiToText(em) {
			for (let i = 0; i < this.$mWebsocket.emojiList.length; i++) {
				if (this.$mWebsocket.emojiList[i].url === em.toString()) {
					return this.$mWebsocket.emojiList[i].alt;
				}
				// console.log(this.emojiList[i].alt)
				if (this.$mWebsocket.emojiList[i].alt === em.toString().trim()) {
					return this.$mWebsocket.emojiList[i].url;
				}
			}
		},
		// 选择表情
		chooseEmoji() {
			this.hideMore = true;
			if (this.hideEmoji) {
				this.bottomHeight = '500upx';
				this.hideEmoji = false;
				this.openDrawer();
			} else {
				this.bottomHeight = 0;
				this.hideDrawer();
			}
		},
		// 打开抽屉
		openDrawer() {
			this.popupLayerClass = 'showLayer';
		},
		discard() {
		},
		// 隐藏抽屉
		hideDrawer() {
			this.popupLayerClass = '';
			setTimeout(() => {
				this.hideMore = true;
				this.hideEmoji = true;
			}, 150);
		},
		// 清除会话记录
		clearChatList() {
			uni.showModal({
				content: '是否清空聊天记录？',
				success: confirmRes => {
					if (confirmRes.confirm) {
						this.clearImHistory();
						this.$mHelper.toast('聊天记录已清空');
						this.bottomHeight = 0;
						this.hideDrawer();
					}
				}
			});
		},
		// 结束会话
		endSession() {
			this.setIsStuffService(false)
			this.$mWebsocket.send(
				JSON.stringify({ route: this.$mWebsocketConfig.memberClose })
			);
			this.bottomHeight = 0;
			this.hideDrawer();
			let params = {
				tip: true,
				content: '人工客服服务已结束，现在由机器人精灵为您服务'
			};
			this.addImHistory(params)

		},
		getAddress() {
			uni.getLocation({
				type: 'gcj02', // 返回可以用于uni.openLocation的经纬度
				success: function(res) {
					const latitude = res.latitude;
					const longitude = res.longitude;
					uni.openLocation({
						latitude: latitude,
						longitude: longitude,
						success: function() {
							console.log('success');
						}
					});
				}
			});
		},
		// 滑到底部
		scrollToBottom() {
			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: 99999999999
				});
			}, 100);
		},
		// 发送消息
		sendMessage(str, type) {
			let msg = str;
			const params = {};
			params.token = this.accessToken;
			params.route = this.isStuffService
				? this.$mWebsocketConfig.serviceMessage
				: this.$mWebsocketConfig.ruleMessage;
			params.params = {};
			params.params.content = msg;
			params.params.type = type || 'text';
			if (this.isStuffService) {
				params.params.member_id =
					this.$mWebsocket.serviceList[0] && this.$mWebsocket.serviceList[0].member_id;
			}
			this.$mWebsocket.send(JSON.stringify(params));
			this.bottomHeight = 0;
			this.scrollToBottom();
		}
	}
};
</script>
<style lang="scss">
page {
	padding-bottom: 100upx;
}

.wrapper {
	position: relative;
}

.icon {
	width: 48upx;
	height: 48upx;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;

	::after {
		width: 48upx;
		height: 48upx;
	}
}

.hidden {
	display: none !important;
}

.popup-layer {
	&.showLayer {
		transform: translate3d(0, -64vw, 0);
	}
	transition: all 0.15s linear;
	width: 100%;
	height: 64vw;
	background-color: #f3f3f3;
	border-top: solid 1upx #ddd;
	position: fixed;
	z-index: 9999;
	top: 100%;
	.more-layer {
		width: 100%;
		height: 64vw;

		.iconfont {
			font-size: 60upx;
		}

		.list {
			width: 100%;
			display: flex;
			.box {
				width: 18vw;
				height: 18vw;
				border-radius: 20upx;
				background-color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 5vw 3vw 5vw 4vw;
				.icon {
					font-size: 45upx;
				}
			}
		}
	}
}

.input-box {
	width: 100%;
	min-height: 100upx;
	padding: 0 1%;
	background-color: #f2f2f2;
	display: flex;
	position: fixed;
	z-index: 9999;
	bottom: -2upx;

	&.showLayer {
		transform: translate3d(0, -64vw, 0);
	}

	transition: all 0.15s linear;
	border-bottom: solid 1upx #ddd;

	.voice,
	.more {
		flex-shrink: 0;
		width: 90upx;
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 48upx;

		.service {
			text-align: center;
			line-height: 1.2;
			font-size: 24upx;

			.iconfont {
				display: block;
				font-size: 32upx;
			}
		}
	}

	.send {
		//H5发送按钮左边距
		/* #ifdef H5 */
		margin-left: 10upx;
		/* #endif */
		flex-shrink: 0;
		width: 100upx;
		margin-top: 20upx;
		height: 60upx;
		display: flex;
		align-items: center;
		border-radius: 6upx;
		.btn {
			width: 90upx;
			height: 56upx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 6upx;
			font-size: 24upx;
		}
	}

	.textbox {
		width: 100%;
		min-height: 70upx;
		margin-top: 15upx;

		.voice-mode {
			width: calc(100% - 2upx);
			height: 68upx;
			border-radius: 70upx;
			border: solid 1upx #cdcdcd;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			background-color: #fff;
			color: #555;

			&.recording {
				background-color: #e5e5e5;
			}
		}

		.text-mode {
			width: 100%;
			min-height: 70upx;
			display: flex;
			background-color: #fff;
			border-radius: 40upx;

			.box {
				width: 100%;
				padding-left: 30upx;
				padding-right:30upx ;
				min-height: 70upx;
				display: flex;
				align-items: center;

				textarea {
					width: 100%;
				}
			}

			.em {
				flex-shrink: 0;
				width: 80upx;
				padding-left: 10upx;
				height: 70upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 40upx;
			}
		}
	}
}

.content {
	width: 100%;

	.msg-list {
		width: 96%;
		padding: 0 2%;
		position: absolute;
		top: 0;
		bottom: 100upx;

		.loading {
			//loading动画
			display: flex;
			justify-content: center;
			@keyframes stretchdelay {
				0%,
				40%,
				100% {
					transform: scaleY(0.6);
				}
				20% {
					transform: scaleY(1);
				}
			}

			.spinner {
				margin: 20upx 0;
				width: 60upx;
				height: 100upx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				view {
					background-color: #f06c7a;
					height: 50upx;
					width: 6upx;
					border-radius: 6upx;
					animation: stretchdelay 1.2s infinite ease-in-out;
				}

				.rect2 {
					animation-delay: -1.1s;
				}

				.rect3 {
					animation-delay: -1s;
				}

				.rect4 {
					animation-delay: -0.9s;
				}

				.rect5 {
					animation-delay: -0.8s;
				}
			}
		}

		.row {
			.system {
				display: flex;
				justify-content: center;

				view {
					padding: 0 30upx;
					height: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #c9c9c9;
					color: #fff;
					font-size: 24upx;
					border-radius: 40upx;
				}

				.red-envelope {
					image {
						margin-right: 5upx;
						width: 30upx;
						height: 30upx;
					}
				}
			}

			&:first-child {
				margin-top: 20upx;
			}

			padding: 20upx 0;

			.my .left,
			.other .right {
				width: 100%;
				display: flex;

				.bubble {
					max-width: 70%;
					min-height: 50upx;
					border-radius: 10upx;
					padding: 15upx 20upx;
					display: flex;
					align-items: center;
					font-size: 32upx;
					word-break: break-word;

					&.img {
						background-color: transparent;
						padding: 0;
						overflow: hidden;

						image {
							flex: 1;
							max-width: 350upx;
							max-height: 350upx;
						}
					}

					&.red-envelope {
						background-color: transparent;
						padding: 0;
						overflow: hidden;
						position: relative;
						justify-content: center;
						align-items: flex-start;

						image {
							width: 250upx;
							height: 313upx;
						}

						.tis {
							position: absolute;
							top: 6%;
							font-size: 26upx;
							color: #9c1712;
						}

						.blessing {
							position: absolute;
							bottom: 14%;
							color: #e9b874;
							width: 80%;
							text-align: center;
							overflow: hidden;
							// 最多两行
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}
					}

					&.voice {
						.icon {
							font-size: 40upx;
							display: flex;
							align-items: center;
						}

						.icon:after {
							content: ' ';
							width: 53upx;
							height: 53upx;
							border-radius: 100%;
							position: absolute;
							box-sizing: border-box;
						}

						.length {
							font-size: 28upx;
						}
					}
				}
			}

			.my .right,
			.other .left {
				flex-shrink: 0;
				width: 80upx;
				height: 80upx;

				image {
					width: 80upx;
					height: 80upx;
					border-radius: 10upx;
				}
			}

			.my {
				width: 100%;
				display: flex;
				justify-content: flex-end;

				.left {
					min-height: 80upx;

					align-items: center;
					justify-content: flex-end;

					.bubble {
						background-color: #f06c7a;
						color: #fff;

						&.voice {
							.icon {
								color: #fff;
							}

							.length {
								margin-right: 20upx;
							}
						}

						&.play {
							@keyframes my-play {
								0% {
									transform: translateX(80%);
								}
								100% {
									transform: translateX(0%);
								}
							}

							.icon:after {
								border-left: solid 10upx rgba(240, 108, 122, 0.5);
								animation: my-play 1s linear infinite;
							}
						}
					}
				}

				.right {
					margin-left: 15upx;
				}
			}

			.other {
				width: 100%;
				display: flex;

				.left {
					margin-right: 15upx;
				}

				.right {
					flex-wrap: wrap;

					.username {
						width: 100%;
						height: 45upx;
						font-size: 24upx;
						color: #999;
						display: flex;

						.name {
							margin-right: 50upx;
						}
					}

					.bubble {
						background-color: #fff;
						color: #333;

						&.voice {
							.icon {
								color: #333;
							}

							.length {
								margin-left: 20upx;
							}
						}

						&.play {
							@keyframes other-play {
								0% {
									transform: translateX(-80%);
								}
								100% {
									transform: translateX(0%);
								}
							}

							.icon:after {
								border-right: solid 10upx rgba(255, 255, 255, 0.8);

								animation: other-play 1s linear infinite;
							}
						}
					}
				}
			}
		}
	}
}

.cu-item {
	.service {
		margin-top: 20upx;
	}

	.name {
		position: absolute;
		left: 160upx;
		top: -2upx;
		margin-bottom: 10upx;
		font-size: 24upx;
		color: #909399;
	}
}
</style>
