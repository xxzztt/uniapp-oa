<template>
	<view class="page">

		<view class="input-t ">
			<text>编号</text>
			<input class="input tit" type="text" v-model="sendDate.serial" placeholder="请输入员工编号,不能为空" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>姓名</text>
			<input class="input tit" type="text" v-model="sendDate.name" placeholder="请输入真实姓名" placeholder-class="placeholder" />
		</view>
		<view class="cu-form-group">
			<view>性别</view>
			<radio-group @change="handleGenderChange">
				<label class="radio margin-right" v-for="(item, index) in gender" :key="index">
					<radio :value="item.key" :checked="item.key === sendDate.gender" :color="themeColor.color" style="transform: scale(0.75);" />
					{{ item.value }}
				</label>
			</radio-group>
		</view>
		<view class="input-t ">
			<text>身份证</text>
			<input class="input tit" type="text" v-model="sendDate.idcard" placeholder="请输入18位身份证号" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>政治面貌</text>
			<view class="tit">
				<picker @change="bindTypeChange" :value="typeindex" :range="type">
					<view class="uni-input">{{type[typeindex]}}</view>
				</picker>
			</view>
		</view>
		<view class="input-t ">
			<text>籍贯</text>
			<input class="input tit" type="text" v-model="sendDate.native" placeholder="请输入籍贯" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>学历</text>
			<input class="input tit" type="text" v-model="sendDate.education" placeholder="请输入最高学历" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>毕业院校</text>
			<input class="input tit" type="text" v-model="sendDate.colleges" placeholder="请输入毕业院校" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>户口所在地</text>
			<input class="input tit" type="text" v-model="sendDate.residence" placeholder="请输入户口所在地" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>手机</text>
			<input class="input tit" type="text" v-model="sendDate.mobile" placeholder="请输入手机号" placeholder-class="placeholder" />
		</view>
		<view class="input-t ">
			<text>邮箱</text>
			<input class="input tit" type="text" v-model="sendDate.mail" placeholder="请输入电子邮箱" placeholder-class="placeholder" />
		</view>

		<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="send">
			确定提交
		</button>

	</view>
</template>

<script>
	import {
		uploadImage
	} from '@/api/userInfo';
	import {
		employees,
		politicalType,
	} from '@/api/basic';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				id: undefined,
				type: [],
				gender: [{key: 0,value: '保密'},{key: 1,value: '男'},{key: 2,value: '女'}],
				typeindex: 0,
				sendDate: {gender:0,},
				btnLoading: false
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
		async onLoad(options) {
			await this.getType();
			this.id = options.id;
			this.getDetail(this.id);
		},
		methods: {
			bindTypeChange(e) {
				this.typeindex = e.target.value
			},
			handleGenderChange(e) {
				this.sendDate.gender = e.detail.value;
			},
			async getType() {
				await this.$http
					.get(`${politicalType}`, {})
					.then(r => {
						this.type = r.data;
					})
			},
			// 获取详情
			async getDetail(id) {
				await this.$http
					.get(`${employees}`+'/view?id='+`${id}`)
					.then(r => {
						this.loading = false;
						this.sendDate = r.data;
						this.typeindex = r.data.political;
						// console.log(this.sendDate);
						this.imageList = JSON.parse(r.data.covers);
						uni.setNavigationBarTitle({
							title: r.data.title
						});
					})
					.catch(() => {
						this.loading = false;
					});
			},
			// 发送数据
			async send() {
				this.btnLoading = true;
				this.sendDate.political = this.typeindex;
				await this.$http
						.put(`${employees}/update?id=${this.id}`, {
						...this.sendDate
					})
					.then(() => {
						this.btnLoading = false;
						this.$mRouter.back();
					})
					.catch(() => {
						this.btnLoading = false;
					});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: $page-color-base;
	}
	.cu-form-group {
		border-style: none;
		background-color: $page-color-base;
		padding: $spacing-base;
		width: 100%;
		display: flex;
		align-items: center;
		// min-height: 100upx;
		justify-content: space-between;
	}
	/*表单标题*/
	.input-t {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: $spacing-base;
		margin-top: $spacing-base;
		font-size: $font-base;

	}

	.tit {
		width: 80%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}

	.input-quick {
		position: relative;
		padding-right: 40upx;

		.iconfont {
			font-size: $font-sm;
		}
	}

	.input-body {
		background: $color-white;
		padding: $spacing-sm $spacing-base;

		.gender-item {
			margin-right: 20upx;

			.gender-item-text {
				padding-left: 10upx;
			}

		}
	}

	.input-textare {
		height: 200upx;
		font-size: 34upx;
		line-height: 50upx;
		width: 100%;
		box-sizing: border-box;
		padding: 20upx 30upx 0;
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
</style>
