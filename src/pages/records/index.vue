<template>
	<view class="page">
		<!-- 分段控件：睡眠 / 喂奶 / 便便 -->
		<view class="seg">
			<view :class="['seg-item', { on: store.activeRecordTab === 'sleep' }]" @click="switchTab('sleep')">😴 睡眠</view>
			<view :class="['seg-item', { on: store.activeRecordTab === 'feed' }]" @click="switchTab('feed')">🍼 喂奶</view>
			<view :class="['seg-item', { on: store.activeRecordTab === 'stool' }]" @click="switchTab('stool')">💩 便便</view>
		</view>

		<!-- ==================== 睡眠 ==================== -->
		<view v-if="store.activeRecordTab === 'sleep'">
			<view class="card sleep-card">
				<view class="sleep-label">哄睡提醒 · 清醒间隔</view>
				<view class="sleep-timer">2 : 10 : 35</view>
				<view class="sleep-sub">5 月龄建议清醒 2-2.5 小时，即将超时</view>
				<view class="btn-primary purple">开始记录睡眠</view>
			</view>
			<view class="card">
				<view class="kv"><text>今日总睡眠</text><text class="b">10.5 小时</text></view>
				<view class="kv"><text>白天小睡</text><text class="b">3 次 · 3.2 小时</text></view>
				<view class="kv"><text>夜间睡眠</text><text class="b">21:00 – 06:30 · 9.5 小时</text></view>
				<view class="kv"><text>夜醒</text><text class="b">2 次</text></view>
				<view class="bars">
					<view class="bar" style="height: 52%;" v-for="(d, i) in week" :key="i">
						<text class="bar-label">{{ d.day }}</text>
						<text class="bar-val">{{ d.hours }}h</text>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="sec-title">💡 本月建议</view>
				<view class="advice-text">5-8 月龄推荐每天 <text class="b">12-15 小时</text>睡眠（含小睡 2-3 次）。当前总量略低于推荐，可尝试将晚间入睡提前至 20:00。</view>
				<view class="note">* 建议参考 NSF 睡眠指南，不构成医疗意见</view>
			</view>
			<view class="card">
				<view class="sec-title">今日记录</view>
				<view class="rec-row">
					<text class="rec-time">12:30–14:00</text>
					<view class="rec-main"><text class="b">小睡 1.5 小时</text> · 抱睡入睡</view>
					<text class="rec-tag">白天</text>
				</view>
				<view class="rec-row">
					<text class="rec-time">20:05–今 06:30</text>
					<view class="rec-main"><text class="b">夜间 9.5 小时</text> · 夜醒 2 次</view>
					<text class="rec-tag">夜醒 40 分钟</text>
				</view>
			</view>
		</view>

		<!-- ==================== 喂奶 ==================== -->
		<view v-if="store.activeRecordTab === 'feed'">
			<view class="card">
				<view class="sec-title">快速记录</view>
				<view class="quick">
					<view class="qbtn">🤱 母乳<text class="qsub">计时开始</text></view>
					<view class="qbtn alt">🍼 奶粉<text class="qsub">输入奶量</text></view>
				</view>
				<view class="kv"><text>距上次喂奶</text><text class="b">3 : 20 : 05</text></view>
				<view class="kv"><text>提醒间隔（5 月龄默认）</text><text class="b">3.5 小时</text></view>
			</view>
			<view class="card">
				<view class="sec-title">今日汇总</view>
				<view class="grid">
					<view class="stat"><view class="t">喂养次数</view><view class="v">5 次</view></view>
					<view class="stat"><view class="t">总奶量</view><view class="v">780 <text class="u">ml</text></view></view>
				</view>
			</view>
			<view class="card">
				<view class="sec-title">今日记录</view>
				<view class="rec-row">
					<text class="rec-time">06:30</text>
					<view class="rec-main"><text class="b">母乳 · 左侧</text> 12 分钟</view>
					<text class="rec-tag">晨奶</text>
				</view>
				<view class="rec-row">
					<text class="rec-time">10:00</text>
					<view class="rec-main"><text class="b">奶粉</text> 150 ml</view>
					<text class="rec-tag">2 段</text>
				</view>
				<view class="rec-row">
					<text class="rec-time">13:30</text>
					<view class="rec-main"><text class="b">母乳 · 双侧</text> 24 分钟</view>
					<text class="rec-tag">辅食后</text>
				</view>
				<view class="rec-row">
					<text class="rec-time">17:00</text>
					<view class="rec-main"><text class="b">奶粉</text> 180 ml</view>
					<text class="rec-tag warn">剩 30 ml</text>
				</view>
				<view class="rec-row">
					<text class="rec-time">21:00</text>
					<view class="rec-main"><text class="b">母乳 · 右侧</text> 15 分钟</view>
					<text class="rec-tag">睡前奶</text>
				</view>
			</view>
			<view class="note center">💡 5 月龄约每 3.5 小时一喂，每日总量约 750-900 ml</view>
		</view>

		<!-- ==================== 便便 ==================== -->
		<view v-if="store.activeRecordTab === 'stool'">
			<view class="card">
				<view class="sec-title">性状</view>
				<view class="chips">
					<view v-for="(t, i) in traits" :key="i" :class="['chip', { on: selectedTrait === t }]" @click="selectedTrait = t">{{ t }}</view>
				</view>
				<view class="sec-title mt">量</view>
				<view class="chips">
					<view v-for="(a, i) in amounts" :key="i" :class="['chip', { on: selectedAmount === a }]" @click="selectedAmount = a">{{ a }}</view>
				</view>
				<view class="btn-primary" @click="saveStool">保存记录</view>
			</view>
			<view class="card">
				<view class="sec-title">今日记录 · 2 次</view>
				<view class="rec-row">
					<text class="rec-time">08:30</text>
					<view class="rec-main"><text class="b">金黄糊状</text> · 中量</view>
					<text class="rec-tag">正常</text>
				</view>
				<view class="rec-row">
					<text class="rec-time">14:20</text>
					<view class="rec-main"><text class="b">奶瓣</text> · 少量<text class="rec-note">备注：今天刚转 2 段奶粉</text></view>
					<text class="rec-tag warn">观察</text>
				</view>
			</view>
			<view class="card stool-tip">
				<view class="stool-tip-text">💡 <text class="b">小提示</text>：转奶期出现少量奶瓣较常见。若持续超过 3 天、伴奶量下降或血丝，建议就医。</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useAppStore } from '@/store/index.js'

export default {
	data() {
		return {
			week: [
				{ day: '周一', hours: 9.8 },
				{ day: '周二', hours: 11.2 },
				{ day: '周三', hours: 9.1 },
				{ day: '周四', hours: 12.3 },
				{ day: '周五', hours: 10.9 },
				{ day: '周六', hours: 13.1 },
				{ day: '今天', hours: 10.5 }
			],
			traits: ['金黄糊状', '黄色软膏', '奶瓣', '绿色', '稀水样', '泡沫', '干硬', '黏液', '血丝'],
			amounts: ['少量', '中量', '多量'],
			selectedTrait: '黄色软膏',
			selectedAmount: '中量'
		}
	},
	computed: {
		store() {
			return useAppStore()
		}
	},
	methods: {
		switchTab(tab) {
			this.store.setActiveRecordTab(tab)
		},
		saveStool() {
			uni.showToast({ title: `已记录：${this.selectedTrait} · ${this.selectedAmount}（演示）`, icon: 'none' })
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

	.seg {
		display: flex;
		background: #EFE8E0;
		border-radius: 24rpx;
		padding: 8rpx;
		margin: 16rpx 0 28rpx;
	}

	.seg-item {
		flex: 1;
		text-align: center;
		font-size: 26rpx;
		padding: 16rpx 0;
		border-radius: 18rpx;
		color: #8A7C71;
	}

	.seg-item.on {
		background: #fff;
		color: #3D3129;
		font-weight: 600;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
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

	.sec-title.mt {
		margin-top: 24rpx;
	}

	/* 睡眠 */
	.sleep-card {
		background: linear-gradient(135deg, #EFEBFA, #E2DBF7);
	}

	.sleep-label {
		font-size: 24rpx;
		color: #7E6BC4;
		font-weight: 600;
	}

	.sleep-timer {
		font-size: 56rpx;
		font-weight: 700;
		color: #3D3129;
		margin: 12rpx 0 4rpx;
	}

	.sleep-sub {
		font-size: 24rpx;
		color: #8A7C71;
	}

	.btn-primary {
		background: #FF8A65;
		color: #fff;
		border-radius: 28rpx;
		padding: 24rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: 600;
		margin-top: 24rpx;
		box-shadow: 0 8rpx 28rpx rgba(255, 138, 101, 0.35);
	}

	.btn-primary.purple {
		background: #7E6BC4;
		box-shadow: 0 8rpx 28rpx rgba(126, 107, 196, 0.35);
	}

	.kv {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		color: #6B5D52;
		padding: 12rpx 0;
	}

	.kv .b {
		font-weight: 600;
		color: #3D3129;
	}

	.bars {
		display: flex;
		align-items: flex-end;
		height: 200rpx;
		padding: 24rpx 8rpx 0;
	}

	.bar {
		flex: 1;
		background: linear-gradient(180deg, #B8A6E8, #8F77D9);
		border-radius: 14rpx 14rpx 6rpx 6rpx;
		position: relative;
		margin: 0 10rpx;
	}

	.bar:last-child {
		background: linear-gradient(180deg, #FFB59A, #FF8A65);
	}

	.bar-label {
		position: absolute;
		bottom: -40rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 20rpx;
		color: #A0938A;
	}

	.bar-val {
		position: absolute;
		top: -32rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 18rpx;
		color: #B5A79C;
	}

	.advice-text {
		font-size: 26rpx;
		line-height: 1.7;
		color: #6B5D52;
	}

	.advice-text .b {
		font-weight: 600;
		color: #3D3129;
	}

	.note {
		font-size: 22rpx;
		color: #B5A79C;
		line-height: 1.6;
		margin-top: 12rpx;
	}

	.note.center {
		text-align: center;
		display: block;
		margin-bottom: 28rpx;
	}

	/* 喂奶 */
	.quick {
		display: flex;
		margin: 16rpx 0 8rpx;
	}

	.qbtn {
		flex: 1;
		background: #FF8A65;
		color: #fff;
		border-radius: 28rpx;
		padding: 24rpx 0;
		text-align: center;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 8rpx 28rpx rgba(255, 138, 101, 0.35);
	}

	.qbtn.alt {
		background: #fff;
		color: #6B5D52;
		border: 3rpx solid #EFE3D8;
		box-shadow: none;
	}

	.qbtn + .qbtn {
		margin-left: 24rpx;
	}

	.qsub {
		display: block;
		font-size: 20rpx;
		font-weight: 400;
		opacity: 0.75;
		margin-top: 4rpx;
	}

	.grid {
		display: flex;
	}

	.stat {
		flex: 1;
	}

	.stat .t {
		font-size: 24rpx;
		color: #A0938A;
	}

	.stat .v {
		font-size: 40rpx;
		font-weight: 700;
		color: #3D3129;
		margin-top: 8rpx;
	}

	.stat .v .u {
		font-size: 22rpx;
		font-weight: 400;
		color: #A0938A;
	}

	/* 记录列表 */
	.rec-row {
		display: flex;
		align-items: center;
		padding: 18rpx 0;
		font-size: 26rpx;
	}

	.rec-row + .rec-row {
		border-top: 1rpx solid #F5EEE6;
	}

	.rec-time {
		color: #A0938A;
		font-size: 22rpx;
		width: 150rpx;
		flex-shrink: 0;
	}

	.rec-main {
		flex: 1;
		color: #3D3129;
		line-height: 1.4;
	}

	.rec-main .b {
		font-weight: 600;
	}

	.rec-note {
		display: block;
		font-size: 20rpx;
		color: #B5A79C;
		margin-top: 4rpx;
	}

	.rec-tag {
		font-size: 20rpx;
		padding: 6rpx 16rpx;
		border-radius: 30rpx;
		background: #F5EEE6;
		color: #8A7C71;
		white-space: nowrap;
	}

	.rec-tag.warn {
		background: #FFF3E0;
		color: #E65100;
	}

	/* 便便 */
	.chips {
		display: flex;
		flex-wrap: wrap;
	}

	.chip {
		font-size: 24rpx;
		padding: 12rpx 26rpx;
		border-radius: 40rpx;
		background: #F5EEE6;
		color: #6B5D52;
		margin: 0 16rpx 16rpx 0;
	}

	.chip.on {
		background: #FF8A65;
		color: #fff;
		font-weight: 600;
	}

	.stool-tip {
		background: #FFF8F0;
		border: 3rpx dashed #FFCCB0;
	}

	.stool-tip-text {
		font-size: 24rpx;
		line-height: 1.7;
		color: #9C6B4E;
	}

	.stool-tip-text .b {
		font-weight: 600;
	}
</style>
