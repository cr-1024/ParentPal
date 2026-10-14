<template>
	<view class="page">
		<view class="page-title">发育体检<text class="sub">0-3 岁全周期计划</text></view>

		<!-- 下次体检 -->
		<view class="card next-card">
			<view class="next-head">
				<view>
					<view class="next-label">下次体检</view>
					<view class="next-title">6 月龄体检</view>
					<view class="next-date">2026-11-01 · 倒计时 18 天</view>
				</view>
				<view class="next-icon">💉</view>
			</view>
			<view class="btn-primary" @click="goCheckupDetail">查看本次检查项目（8 项）</view>
			<view class="btn-outline">标记为已预约</view>
		</view>

		<!-- 检查范围 -->
		<view class="card">
			<view class="sec-title">本次体检范围</view>
			<view class="scope-row"><text class="scope-icon">📏</text><text class="scope-main">体格测量：身长 · 体重 · 头围</text></view>
			<view class="scope-row"><text class="scope-icon">🩺</text><text class="scope-main">体格检查：皮肤 · 心肺 · 腹部 · 髋关节</text></view>
			<view class="scope-row"><text class="scope-icon">🧩</text><text class="scope-main">发育评估：大运动 / 精细 / 语言 / 社交</text></view>
			<view class="scope-row"><text class="scope-icon">🍽️</text><text class="scope-main">营养与喂养指导 · 辅食添加建议</text></view>
			<view class="note">* 具体项目按当地社区医院与医嘱执行，提前 7 天 / 1 天提醒</view>
		</view>

		<!-- 成长曲线（图表库接入点） -->
		<view class="card">
			<view class="sec-title">成长曲线 · 体重</view>
			<view class="chart-placeholder">
				<text class="chart-emoji">📈</text>
				<text class="chart-tip">ucharts 成长曲线接入点</text>
			</view>
			<view class="chart-desc">当前 7.2 kg · 处于同月龄中位水平</view>
		</view>

		<!-- 体检时间轴 -->
		<view class="card">
			<view class="sec-title">体检时间轴</view>
			<view class="tl">
				<view class="tl-item done"><text class="tl-name">新生儿访视</text><text class="tl-state">✔ 已完成</text></view>
				<view class="tl-item done"><text class="tl-name">满月体检</text><text class="tl-state">✔ 已完成</text></view>
				<view class="tl-item done"><text class="tl-name">3 月龄</text><text class="tl-state">✔ 已完成</text></view>
				<view class="tl-item next"><text class="tl-name">6 月龄</text><text class="tl-state">18 天后</text></view>
				<view class="tl-item"><text class="tl-name">8 月龄</text><text class="tl-state">未到</text></view>
				<view class="tl-item"><text class="tl-name">12 月龄</text><text class="tl-state">未到</text></view>
				<view class="tl-item"><text class="tl-name">18 月龄</text><text class="tl-state">未到</text></view>
				<view class="tl-item"><text class="tl-name">24 / 30 / 36 月龄</text><text class="tl-state">未到</text></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		goCheckupDetail() {
			uni.showToast({ title: '检查项目详情页（M1 建设）', icon: 'none' })
		}
	}
}
</script>

<style>
	page {
		background-color: #FAF6F0;
	}

	.page {
		padding: 24rpx 36rpx 60rpx;
	}

	.page-title {
		font-size: 48rpx;
		font-weight: 700;
		color: #3D3129;
		margin: 20rpx 0 32rpx;
	}

	.page-title .sub {
		display: block;
		font-size: 24rpx;
		color: #A0938A;
		font-weight: 400;
		margin-top: 8rpx;
	}

	.card {
		background: #fff;
		border-radius: 36rpx;
		padding: 32rpx;
		margin-bottom: 28rpx;
		box-shadow: 0 4rpx 20rpx rgba(61, 49, 41, 0.05);
	}

	.next-card {
		background: linear-gradient(135deg, #FFE9DC, #FFD9C7);
	}

	.next-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.next-label {
		font-size: 24rpx;
		color: #9C6B4E;
		font-weight: 600;
	}

	.next-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #3D3129;
		margin-top: 8rpx;
	}

	.next-date {
		font-size: 24rpx;
		color: #9C6B4E;
		margin-top: 8rpx;
	}

	.next-icon {
		font-size: 68rpx;
	}

	.btn-primary {
		background: #FF8A65;
		color: #fff;
		border-radius: 28rpx;
		padding: 26rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: 600;
		margin-top: 28rpx;
		box-shadow: 0 8rpx 28rpx rgba(255, 138, 101, 0.35);
	}

	.btn-outline {
		background: #fff;
		color: #FF7043;
		border: 3rpx solid #FF8A65;
		border-radius: 28rpx;
		padding: 24rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: 600;
		margin-top: 20rpx;
	}

	.sec-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #3D3129;
		margin-bottom: 12rpx;
	}

	.scope-row {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #3D3129;
		padding: 14rpx 0;
	}

	.scope-icon {
		width: 44rpx;
		margin-right: 20rpx;
	}

	.note {
		font-size: 22rpx;
		color: #B5A79C;
		line-height: 1.6;
		margin-top: 12rpx;
	}

	.chart-placeholder {
		height: 220rpx;
		background: #FAF6F0;
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.chart-emoji {
		font-size: 56rpx;
	}

	.chart-tip {
		font-size: 24rpx;
		color: #B5A79C;
		margin-top: 8rpx;
	}

	.chart-desc {
		font-size: 24rpx;
		color: #8A7C71;
		margin-top: 16rpx;
	}

	.tl {
		position: relative;
		padding-left: 52rpx;
	}

	.tl::before {
		content: '';
		position: absolute;
		left: 16rpx;
		top: 16rpx;
		bottom: 16rpx;
		width: 4rpx;
		background: #EFE3D8;
	}

	.tl-item {
		position: relative;
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		color: #6B5D52;
		padding: 14rpx 0;
	}

	.tl-item::before {
		content: '';
		position: absolute;
		left: -46rpx;
		top: 24rpx;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background: #CDBCA9;
		border: 4rpx solid #fff;
	}

	.tl-item.done::before {
		background: #7BC47F;
	}

	.tl-item.next::before {
		background: #FF8A65;
		box-shadow: 0 0 0 8rpx rgba(255, 138, 101, 0.2);
	}

	.tl-item.next {
		font-weight: 700;
		color: #3D3129;
	}

	.tl-state {
		font-size: 24rpx;
		color: #A0938A;
	}
</style>
