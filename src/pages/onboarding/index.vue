<template>
	<view class="page">
		<!-- 进度点 -->
		<view class="dots" v-if="step > 0">
			<view :class="['dot', { on: step >= 1 }]"></view>
			<view :class="['dot', { on: step >= 2 }]"></view>
		</view>

		<!-- Step 0：欢迎 -->
		<view class="step welcome" v-if="step === 0">
			<view class="welcome-emoji">👶</view>
			<view class="welcome-title">ParentPal</view>
			<view class="welcome-sub">家长伙伴 · 新手父母的科学养娃助手</view>
			<view class="feature-list">
				<view class="feature-item"><text class="f-icon">💉</text><view class="f-text"><text class="f-title">发育体检提醒</text><text class="f-desc">0-3 岁全周期计划，提前提醒不遗漏</text></view></view>
				<view class="feature-item"><text class="f-icon">😴</text><view class="f-text"><text class="f-title">睡眠 · 喂奶 · 便便记录</text><text class="f-desc">两步完成记录，统计与建议一目了然</text></view></view>
				<view class="feature-item"><text class="f-icon">📚</text><view class="f-text"><text class="f-title">按月龄育儿指导</text><text class="f-desc">发育里程碑、亲子游戏、音乐启蒙</text></view></view>
			</view>
			<view class="btn-primary" @click="step = 1">开始设置</view>
			<view class="privacy">数据仅保存在本机，可随时导出或删除</view>
		</view>

		<!-- Step 1：选择身份 -->
		<view class="step" v-if="step === 1">
			<view class="step-title">你好，新手家长</view>
			<view class="step-sub">选择你的身份，我们会调整称呼与内容侧重</view>
			<view class="role-cards">
				<view :class="['role-card', { on: form.role === 'mom' }]" @click="form.role = 'mom'">
					<text class="role-emoji">👩</text>
					<text class="role-name">宝妈</text>
					<text class="role-desc">侧重喂养与发育细节</text>
				</view>
				<view :class="['role-card', { on: form.role === 'dad' }]" @click="form.role = 'dad'">
					<text class="role-emoji">👨</text>
					<text class="role-name">宝爸</text>
					<text class="role-desc">侧重作息与运动陪伴</text>
				</view>
			</view>
			<view class="btn-primary" :class="{ disabled: !form.role }" @click="goBabyStep">下一步</view>
		</view>

		<!-- Step 2：宝宝信息 -->
		<view class="step" v-if="step === 2">
			<view class="step-title">宝宝的基本信息</view>
			<view class="step-sub">生日将决定体检计划、喂奶间隔与睡眠建议，请填写准确</view>
			<view class="form-card">
				<view class="field">
					<text class="field-label">昵称</text>
					<input class="field-input" v-model="form.name" placeholder="宝宝昵称，如：小糯米" maxlength="12" />
				</view>
				<view class="field">
					<text class="field-label">性别</text>
					<view class="gender-opts">
						<view :class="['gender-opt', { on: form.gender === '男' }]" @click="form.gender = '男'">男</view>
						<view :class="['gender-opt', { on: form.gender === '女' }]" @click="form.gender = '女'">女</view>
					</view>
				</view>
				<view class="field">
					<text class="field-label">出生日期</text>
					<picker mode="date" :value="form.birthday" @change="onBirthdayChange">
						<view class="picker-value">{{ form.birthday || '请选择 📅' }}</view>
					</picker>
				</view>
				<view class="field">
					<text class="field-label">出生体重</text>
					<input class="field-input" type="digit" v-model="form.birthWeight" placeholder="选填，如 3.3" maxlength="5" />
					<text class="field-unit">kg</text>
				</view>
				<view class="field">
					<text class="field-label">出生身长</text>
					<input class="field-input" type="digit" v-model="form.birthHeight" placeholder="选填，如 50" maxlength="5" />
					<text class="field-unit">cm</text>
				</view>
			</view>
			<view class="btn-primary" :class="{ disabled: !canSubmit }" @click="submit">{{ submitting ? '进入中…' : '完成，进入 ParentPal' }}</view>
			<view class="btn-text" @click="step = 1">上一步</view>
		</view>
	</view>
</template>

<script>
import { useAppStore } from '@/store/index.js'

export default {
	data() {
		return {
			store: null,
			step: 0,
			submitting: false,
			form: {
				role: '',
				name: '',
				gender: '男',
				birthday: '',
				birthWeight: '',
				birthHeight: ''
			}
		}
	},
	computed: {
		appStore() {
			return useAppStore()
		},
		canSubmit() {
			return !!this.form.name && !!this.form.birthday
		}
	},
	onLoad() {
		this.appStore.initData()
		if (this.appStore.initialized) {
			uni.reLaunch({ url: '/pages/index/index' })
		}
	},
	methods: {
		goBabyStep() {
			if (!this.form.role) return
			this.step = 2
		},
		onBirthdayChange(e) {
			this.form.birthday = e.detail.value
		},
		submit() {
			if (!this.canSubmit || this.submitting) return
			this.submitting = true
			this.appStore.completeOnboarding({
				role: this.form.role,
				baby: {
					name: this.form.name,
					gender: this.form.gender,
					birthday: this.form.birthday,
					birthWeight: this.form.birthWeight,
					birthHeight: this.form.birthHeight
				}
			})
			uni.reLaunch({ url: '/pages/index/index' })
		}
	}
}
</script>

<style>
	page {
		background: linear-gradient(180deg, #FFE9DC 0%, #FAF6F0 40%);
	}

	.page {
		padding: 40rpx 48rpx 60rpx;
		min-height: 100vh;
	}

	.dots {
		display: flex;
		justify-content: center;
		margin-bottom: 48rpx;
	}

	.dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background: #E3D5C8;
		margin: 0 8rpx;
	}

	.dot.on {
		background: #FF8A65;
	}

	/* 欢迎页 */
	.welcome {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 80rpx;
	}

	.welcome-emoji {
		font-size: 140rpx;
	}

	.welcome-title {
		font-size: 64rpx;
		font-weight: 800;
		color: #3D3129;
		margin-top: 24rpx;
		letter-spacing: 4rpx;
	}

	.welcome-sub {
		font-size: 26rpx;
		color: #9C6B4E;
		margin-top: 12rpx;
	}

	.feature-list {
		width: 100%;
		margin: 64rpx 0 48rpx;
	}

	.feature-item {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.85);
		border-radius: 28rpx;
		padding: 28rpx;
		margin-bottom: 20rpx;
	}

	.f-icon {
		font-size: 48rpx;
		margin-right: 24rpx;
	}

	.f-text {
		flex: 1;
	}

	.f-title {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #3D3129;
	}

	.f-desc {
		display: block;
		font-size: 22rpx;
		color: #A0938A;
		margin-top: 6rpx;
	}

	.privacy {
		font-size: 20rpx;
		color: #C9BCB2;
		margin-top: 28rpx;
	}

	/* 步骤通用 */
	.step-title {
		font-size: 44rpx;
		font-weight: 700;
		color: #3D3129;
		margin: 24rpx 0 12rpx;
	}

	.step-sub {
		font-size: 24rpx;
		color: #A0938A;
		line-height: 1.6;
		margin-bottom: 40rpx;
	}

	.btn-primary {
		width: 100%;
		background: #FF8A65;
		color: #fff;
		border-radius: 32rpx;
		padding: 28rpx 0;
		text-align: center;
		font-size: 30rpx;
		font-weight: 600;
		box-shadow: 0 8rpx 28rpx rgba(255, 138, 101, 0.35);
	}

	.btn-primary.disabled {
		background: #E3D5C8;
		box-shadow: none;
	}

	.btn-text {
		text-align: center;
		font-size: 26rpx;
		color: #A0938A;
		padding: 24rpx 0;
	}

	/* 角色选择 */
	.role-cards {
		display: flex;
		margin-bottom: 56rpx;
	}

	.role-card {
		flex: 1;
		background: #fff;
		border-radius: 32rpx;
		padding: 48rpx 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 4rpx solid transparent;
		box-shadow: 0 4rpx 20rpx rgba(61, 49, 41, 0.05);
	}

	.role-card + .role-card {
		margin-left: 24rpx;
	}

	.role-card.on {
		border-color: #FF8A65;
		background: #FFF3EC;
	}

	.role-emoji {
		font-size: 88rpx;
	}

	.role-name {
		font-size: 34rpx;
		font-weight: 700;
		color: #3D3129;
		margin-top: 16rpx;
	}

	.role-desc {
		font-size: 22rpx;
		color: #A0938A;
		margin-top: 10rpx;
	}

	/* 表单 */
	.form-card {
		background: #fff;
		border-radius: 32rpx;
		padding: 32rpx 28rpx;
		margin-bottom: 40rpx;
	}

	.field {
		display: flex;
		align-items: center;
		padding: 16rpx 0;
	}

	.field-label {
		width: 150rpx;
		font-size: 26rpx;
		color: #8A7C71;
	}

	.field-input {
		flex: 1;
		background: #FAF6F0;
		border-radius: 16rpx;
		padding: 18rpx 24rpx;
		font-size: 28rpx;
	}

	.field-unit {
		font-size: 24rpx;
		color: #8A7C71;
		margin-left: 16rpx;
	}

	.gender-opts {
		flex: 1;
		display: flex;
	}

	.gender-opt {
		padding: 12rpx 44rpx;
		background: #FAF6F0;
		border-radius: 40rpx;
		font-size: 26rpx;
		color: #8A7C71;
		margin-right: 20rpx;
	}

	.gender-opt.on {
		background: #FF8A65;
		color: #fff;
		font-weight: 600;
	}

	.picker-value {
		flex: 1;
		background: #FAF6F0;
		border-radius: 16rpx;
		padding: 18rpx 24rpx;
		font-size: 28rpx;
		color: #3D3129;
	}
</style>
