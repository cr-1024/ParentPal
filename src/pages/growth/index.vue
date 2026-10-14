<template>
	<view class="page">
		<view class="page-title">成长指导<text class="sub">当前 5 月龄 · 本月主题：声音探索期</text></view>

		<!-- 发育里程碑 -->
		<view class="card milestone-card">
			<view class="sec-title">🎯 本月发育里程碑</view>
			<view class="ms-row"><text class="ms-k">大运动</text><text class="ms-v">翻身自如 → 扶坐</text></view>
			<view class="ms-row"><text class="ms-k">精细动作</text><text class="ms-v">双手抓握 → 主动够物</text></view>
			<view class="ms-row"><text class="ms-k">语言</text><text class="ms-v">咿呀学语、模仿语调</text></view>
			<view class="ms-row"><text class="ms-k">社交</text><text class="ms-v">认生、对镜微笑</text></view>
		</view>

		<!-- 音乐启蒙（重点栏目） -->
		<view class="card music-card">
			<view class="sec-title">🎵 音乐启蒙（本月重点）</view>
			<view class="music-row">· <text class="b">白噪音</text>：雨声、吹风机声，安抚情绪</view>
			<view class="music-row">· <text class="b">轻柔古典</text>：舒伯特《摇篮曲》、莫扎特《小夜曲》K.525 第一乐章</view>
			<view class="music-row">· <text class="b">节奏儿歌</text>：带拍手动作的简单童谣</view>
			<view class="music-row">· <text class="b">建议</text>：每次 15-20 分钟，音量低于 60 分贝</view>
			<view class="btn-outline" @click="playlist">播放本月歌单</view>
		</view>

		<!-- 亲子互动 -->
		<view class="card">
			<view class="sec-title">🧸 亲子互动推荐</view>
			<view class="rec-row"><text class="rec-icon">🪞</text><view class="rec-main"><text class="b">照镜子游戏</text> · 认识自己 · 每天 2 次</view></view>
			<view class="rec-row"><text class="rec-icon">🤲</text><view class="rec-main"><text class="b">抓握练习</text> · 摇铃/牙胶 · 每天 3 组</view></view>
			<view class="rec-row"><text class="rec-icon">🙈</text><view class="rec-main"><text class="b">躲猫猫</text> · 物体永恒性启蒙</view></view>
		</view>

		<!-- 收藏与预告 -->
		<view class="card">
			<view class="kv"><text class="kv-k">收藏本篇</text><text class="star">☆</text></view>
			<view class="kv"><text class="kv-k">下周预告</text><text class="kv-v">6 月龄：辅食添加 ›</text></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		playlist() {
			uni.showToast({ title: '本月歌单（M2 接入音频）', icon: 'none' })
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

	.sec-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #3D3129;
		margin-bottom: 12rpx;
	}

	.milestone-card {
		background: linear-gradient(135deg, #E6F4E8, #D5EDD9);
	}

	.ms-row {
		display: flex;
		font-size: 26rpx;
		color: #3D5A40;
		padding: 10rpx 0;
		line-height: 1.5;
	}

	.ms-k {
		width: 130rpx;
		font-weight: 600;
		flex-shrink: 0;
	}

	.music-card {
		border: 4rpx solid #B8A6E8;
	}

	.music-row {
		font-size: 26rpx;
		line-height: 1.8;
		color: #4A3F63;
	}

	.music-row .b {
		font-weight: 600;
	}

	.btn-outline {
		background: #fff;
		color: #7E6BC4;
		border: 3rpx solid #B8A6E8;
		border-radius: 28rpx;
		padding: 22rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: 600;
		margin-top: 24rpx;
	}

	.rec-row {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #3D3129;
		padding: 14rpx 0;
	}

	.rec-icon {
		width: 44rpx;
		margin-right: 20rpx;
	}

	.rec-main {
		flex: 1;
		line-height: 1.4;
	}

	.rec-main .b {
		font-weight: 600;
	}

	.kv {
		display: flex;
		justify-content: space-between;
		padding: 12rpx 0;
	}

	.kv-k {
		font-size: 26rpx;
		color: #8A7C71;
	}

	.star {
		font-size: 32rpx;
		color: #FFCC80;
	}

	.kv-v {
		font-size: 24rpx;
		color: #B5A79C;
	}
</style>
