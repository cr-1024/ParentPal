<template>
	<view class="page">
		<view class="page-title">早上好，宝妈<text class="sub">今天也要科学养娃</text></view>

		<!-- 宝宝卡片 -->
		<view class="card baby-card">
			<view class="avatar">👶</view>
			<view class="baby-info">
				<view class="baby-name">{{ store.baby.name }}</view>
				<view class="baby-meta">{{ store.baby.gender }} · 今天 {{ store.baby.ageText }} · {{ store.baby.birthday }} 出生</view>
			</view>
		</view>

		<!-- 今日提醒 -->
		<view class="card reminder">
			<view class="reminder-row">
				<view class="r-icon orange">💉</view>
				<view class="r-text">
					<text class="b">6 月龄体检</text> 倒计时 <text class="r-time">18 天</text>
					<text class="r-sub">2026-11-01 · 社区医院</text>
				</view>
			</view>
			<view class="reminder-row">
				<view class="r-icon purple">😴</view>
				<view class="r-text">
					已清醒 <text class="b">2 小时 10 分</text>，超过该月龄建议间隔
					<text class="r-time">该哄睡啦</text>
				</view>
			</view>
			<view class="reminder-row">
				<view class="r-icon green">🍼</view>
				<view class="r-text">
					距上次喂奶 <text class="b">3 小时 20 分</text>
					<text class="r-time">即将到点</text>
				</view>
			</view>
		</view>

		<!-- 今日概览 -->
		<view class="grid">
			<view class="stat">
				<view class="t">😴 今日睡眠</view>
				<view class="v">10.5 <text class="u">小时 · 3 次小睡</text></view>
			</view>
			<view class="stat">
				<view class="t">🍼 今日喂奶</view>
				<view class="v">5 次 <text class="u">/ 780 ml</text></view>
			</view>
			<view class="stat">
				<view class="t">💩 今日便便</view>
				<view class="v">2 <text class="u">次 · 性状正常</text></view>
			</view>
			<view class="stat">
				<view class="t">📈 成长曲线</view>
				<view class="v">7.2 <text class="u">kg · 处于中位</text></view>
			</view>
		</view>

		<!-- 快捷记录 -->
		<view class="quick">
			<view class="qbtn" @click="goRecord('feed')">🍼 记喂奶</view>
			<view class="qbtn alt" @click="goRecord('sleep')">😴 记睡眠</view>
			<view class="qbtn alt" @click="goRecord('stool')">💩 记便便</view>
		</view>

		<!-- 本月指导入口 -->
		<view class="card guide-entry" @click="goGrowth">
			<text>📚 本月指导已更新：</text>
			<text class="b">5 月龄音乐启蒙 · 白噪音与轻柔古典</text>
			<text class="arrow">›</text>
		</view>
	</view>
</template>

<script>
import { useAppStore } from '@/store/index.js'

export default {
	data() {
		return {}
	},
	computed: {
		store() {
			return useAppStore()
		}
	},
	methods: {
		goRecord(tab) {
			this.store.setActiveRecordTab(tab)
			uni.switchTab({ url: '/pages/records/index' })
		},
		goGrowth() {
			uni.switchTab({ url: '/pages/growth/index' })
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

	.baby-card {
		background: linear-gradient(135deg, #FFE9DC, #FFD9C7);
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 104rpx;
		height: 104rpx;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 52rpx;
		margin-right: 28rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	}

	.baby-name {
		font-size: 34rpx;
		font-weight: 700;
		color: #3D3129;
	}

	.baby-meta {
		font-size: 24rpx;
		color: #9C6B4E;
		margin-top: 8rpx;
	}

	.reminder {
		border-left: 8rpx solid #FF8A65;
	}

	.reminder-row {
		display: flex;
		align-items: flex-start;
		padding: 18rpx 0;
	}

	.reminder-row + .reminder-row {
		border-top: 1rpx dashed #F0E4DA;
	}

	.r-icon {
		width: 60rpx;
		height: 60rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.r-icon.orange { background: #FFEDE4; }
	.r-icon.purple { background: #EFEBFA; }
	.r-icon.green { background: #E6F4E8; }

	.r-text {
		flex: 1;
		font-size: 26rpx;
		line-height: 1.5;
		color: #3D3129;
	}

	.r-text .b {
		font-weight: 600;
	}

	.r-text .r-sub {
		display: block;
		font-size: 22rpx;
		color: #A0938A;
		margin-top: 4rpx;
	}

	.r-time {
		color: #FF7043;
		font-weight: 600;
		font-size: 24rpx;
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-bottom: 28rpx;
	}

	.stat {
		width: 48.5%;
		background: #fff;
		border-radius: 32rpx;
		padding: 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(61, 49, 41, 0.05);
	}

	.stat .t {
		font-size: 24rpx;
		color: #A0938A;
	}

	.stat .v {
		font-size: 38rpx;
		font-weight: 700;
		color: #3D3129;
		margin-top: 12rpx;
	}

	.stat .v .u {
		font-size: 22rpx;
		font-weight: 400;
		color: #A0938A;
		margin-left: 8rpx;
	}

	.quick {
		display: flex;
		margin-bottom: 28rpx;
	}

	.qbtn {
		flex: 1;
		background: #FF8A65;
		color: #fff;
		border-radius: 32rpx;
		padding: 26rpx 0;
		text-align: center;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 8rpx 28rpx rgba(255, 138, 101, 0.35);
	}

	.qbtn.alt {
		background: #fff;
		color: #6B5D52;
		box-shadow: 0 4rpx 20rpx rgba(61, 49, 41, 0.06);
	}

	.qbtn + .qbtn {
		margin-left: 24rpx;
	}

	.guide-entry {
		padding: 24rpx 32rpx;
		font-size: 24rpx;
		color: #8A7C71;
		display: flex;
		align-items: center;
	}

	.guide-entry .b {
		color: #6B5D52;
		font-weight: 600;
	}

	.guide-entry .arrow {
		margin-left: auto;
		color: #C9BCB2;
		font-size: 36rpx;
	}
</style>
