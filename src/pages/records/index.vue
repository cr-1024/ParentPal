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
			<!-- 进行中的睡眠记录 -->
			<view class="card sleep-card recording" v-if="store.activeSleep">
				<view class="sleep-label">正在记录睡眠 · 入睡 {{ fmtTime(store.activeSleep.startTs) }}</view>
				<view class="sleep-timer">{{ elapsedText }}</view>
				<view class="night-wakes">
					<text class="nw-label">夜醒次数</text>
					<view class="stepper">
						<view class="step-btn" @click="nightWakes = Math.max(0, nightWakes - 1)">−</view>
						<text class="step-val">{{ nightWakes }}</text>
						<view class="step-btn" @click="nightWakes = nightWakes + 1">＋</view>
					</view>
				</view>
				<view class="btn-primary purple" @click="stopSleep">醒来，保存记录</view>
			</view>
			<!-- 未开始 -->
			<view class="card sleep-card" v-else>
				<view class="sleep-label">哄睡提醒 · 清醒间隔</view>
				<view class="sleep-timer" v-if="awakeText">{{ awakeText }}</view>
				<view class="sleep-timer" v-else>--:--:--</view>
				<view class="sleep-sub">5 月龄建议清醒 2-2.5 小时{{ awakeOver ? '，已超时，尽快哄睡' : '' }}</view>
				<view class="btn-primary purple" @click="startSleep">开始记录睡眠</view>
			</view>

			<!-- 近 7 天统计 -->
			<view class="card">
				<view class="sec-title">近 7 天睡眠时长</view>
				<view class="bars" v-if="weekStats.some(d => d.hours > 0)">
					<view class="bar" v-for="(d, i) in weekStats" :key="i" :style="{ height: (d.hours / 15 * 100) + '%' }">
						<text class="bar-val" v-if="d.hours > 0">{{ d.hours.toFixed(1) }}</text>
						<text class="bar-label">{{ d.day }}</text>
					</view>
				</view>
				<view class="empty-inline" v-else>还没有睡眠记录，从今晚开始吧</view>
			</view>

			<!-- 今日记录 -->
			<view class="card">
				<view class="sec-title">今日记录（{{ store.todaySleeps.length }}）</view>
				<view class="empty-inline" v-if="!store.todaySleeps.length">今天还没有睡眠记录</view>
				<view class="rec-row" v-for="r in store.todaySleeps" :key="r.id">
					<text class="rec-time">{{ fmtTime(r.start) }}–{{ r.end ? fmtTime(r.end) : '进行中' }}</text>
					<view class="rec-main">
						<text class="b">{{ r.end ? fmtDuration(r.start, r.end) : '记录中' }}</text>
						<text class="rec-note" v-if="r.method">· {{ r.method }}</text>
						<text class="rec-note" v-if="r.nightWakes">· 夜醒 {{ r.nightWakes }} 次</text>
					</view>
					<text class="rec-del" @click="removeSleep(r.id)">✕</text>
				</view>
			</view>
		</view>

		<!-- ==================== 喂奶 ==================== -->
		<view v-if="store.activeRecordTab === 'feed'">
			<view class="card">
				<view class="sec-title">快速记录</view>
				<!-- 计时中 -->
				<template v-if="store.feedingTimer.running">
					<view class="feeding-timer">
						<text class="ft-label">母乳计时中（{{ store.feedingTimer.side === 'left' ? '左侧' : '右侧' }}）</text>
						<text class="ft-time">{{ elapsedText }}</text>
					</view>
					<view class="btn-primary" @click="stopFeeding">停止并保存</view>
				</template>
				<!-- 未计时 -->
				<template v-else>
					<view class="quick">
						<view class="qbtn" @click="startFeeding('left')">🤱 左侧<text class="qsub">计时开始</text></view>
						<view class="qbtn" @click="startFeeding('right')">🤱 右侧<text class="qsub">计时开始</text></view>
						<view class="qbtn alt" @click="openFormulaModal">🍼 奶粉<text class="qsub">输入奶量</text></view>
					</view>
				</template>
				<view class="kv"><text>距上次喂奶</text><text class="b">{{ lastFeedText }}</text></view>
				<view class="kv"><text>提醒间隔（按月龄）</text><text class="b">{{ feedIntervalText }}</text></view>
			</view>

			<view class="card">
				<view class="sec-title">今日汇总</view>
				<view class="grid">
					<view class="stat"><view class="t">喂养次数</view><view class="v">{{ store.todayStats.feedCount }} 次</view></view>
					<view class="stat"><view class="t">总奶量</view><view class="v">{{ store.todayStats.feedVolume }} <text class="u">ml</text></view></view>
				</view>
			</view>

			<view class="card">
				<view class="sec-title">今日记录（{{ store.todayFeeds.length }}）</view>
				<view class="empty-inline" v-if="!store.todayFeeds.length">今天还没有喂奶记录</view>
				<view class="rec-row" v-for="r in store.todayFeeds" :key="r.id">
					<text class="rec-time">{{ fmtTime(r.time) }}</text>
					<view class="rec-main">
						<text class="b">{{ r.type === 'breast' ? `母乳 · ${r.side === 'left' ? '左侧' : '右侧'}` : '奶粉' }}</text>
						<text class="rec-note">{{ r.type === 'breast' ? ` ${r.breastMinutes} 分钟` : ` ${r.volumeMl} ml` }}</text>
					</view>
					<text class="rec-del" @click="removeFeeding(r.id)">✕</text>
				</view>
			</view>
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
				<view class="sec-title mt">备注</view>
				<input class="note-input" v-model="stoolNote" placeholder="选填，如：刚转 2 段奶粉" />
				<view class="btn-primary" @click="saveStool">保存记录</view>
			</view>

			<view class="card">
				<view class="sec-title">今日记录（{{ store.todayStools.length }}）</view>
				<view class="empty-inline" v-if="!store.todayStools.length">今天还没有排便记录</view>
				<view class="rec-row" v-for="r in store.todayStools" :key="r.id">
					<text class="rec-time">{{ fmtTime(r.time) }}</text>
					<view class="rec-main">
						<text class="b">{{ r.trait }}</text> · {{ r.amount }}
						<text class="rec-note" v-if="r.note">备注：{{ r.note }}</text>
					</view>
					<text class="rec-del" @click="removeStool(r.id)">✕</text>
				</view>
			</view>

			<view class="card stool-tip" v-if="abnormalTip">
				<view class="stool-tip-text">💡 <text class="b">小提示</text>：{{ abnormalTip }}。若持续超过 3 天、伴奶量下降或血丝，建议就医。</view>
			</view>
		</view>

		<!-- 奶粉奶量输入弹窗 -->
		<view class="modal-mask" v-if="showFormulaModal" @click="showFormulaModal = false">
			<view class="modal" @click.stop>
				<view class="modal-title">记录奶粉</view>
				<view class="field">
					<text class="field-label">奶量</text>
					<input class="field-input" type="number" v-model="formulaMl" placeholder="ml" focus />
					<text class="field-unit">ml</text>
				</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showFormulaModal = false">取消</view>
					<view class="modal-btn confirm" @click="saveFormula">保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useAppStore } from '@/store/index.js'
import { feedIntervalHours, awakeWindowHours, getLastSleepEnd } from '@/utils/reminder.js'
import { fmtTime, diffMinutes, startOfToday } from '@/utils/date.js'

export default {
	data() {
		return {
			nowTick: Date.now(),
			nightWakes: 0,
			traits: ['金黄糊状', '黄色软膏', '奶瓣', '绿色', '稀水样', '泡沫', '干硬', '黏液', '血丝'],
			amounts: ['少量', '中量', '多量'],
			selectedTrait: '黄色软膏',
			selectedAmount: '中量',
			stoolNote: '',
			showFormulaModal: false,
			formulaMl: ''
		}
	},
	computed: {
		store() {
			return useAppStore()
		},
		elapsedText() {
			const start = this.store.activeSleep
				? this.store.activeSleep.startTs
				: (this.store.feedingTimer.running ? this.store.feedingTimer.startTs : null)
			if (!start) return ''
			const sec = Math.max(0, Math.floor((this.nowTick - start) / 1000))
			const h = String(Math.floor(sec / 3600)).padStart(2, '0')
			const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
			const s = String(sec % 60).padStart(2, '0')
			return `${h}:${m}:${s}`
		},
		awakeText() {
			const lastEnd = getLastSleepEnd(this.store.sleepRecords)
			if (!lastEnd) return ''
			const min = diffMinutes(lastEnd, Date.now())
			const h = String(Math.floor(min / 60)).padStart(2, '0')
			const m = String(min % 60).padStart(2, '0')
			return `${h}:${m}`
		},
		awakeOver() {
			const lastEnd = getLastSleepEnd(this.store.sleepRecords)
			if (!lastEnd) return false
			return diffMinutes(lastEnd, Date.now()) >= awakeWindowHours(this.store.baby.birthday) * 60
		},
		feedIntervalText() {
			return feedIntervalHours(this.store.baby.birthday) + ' 小时'
		},
		lastFeedText() {
			const list = this.store.feedingRecords
			if (!list.length) return '暂无记录'
			const min = diffMinutes(list[list.length - 1].time, Date.now())
			if (min < 60) return `${min} 分钟`
			return `${Math.floor(min / 60)} 小时 ${min % 60} 分钟`
		},
		weekStats() {
			const today = startOfToday()
			const days = []
			for (let i = 6; i >= 0; i--) {
				const dayStart = today - i * 86400000
				const dayEnd = dayStart + 86400000
				const minutes = this.store.sleepRecords
					.filter((r) => r.start >= dayStart && r.start < dayEnd && r.end)
					.reduce((sum, r) => sum + diffMinutes(r.start, r.end), 0)
				const d = new Date(dayStart)
				days.push({ day: i === 0 ? '今天' : ['日', '一', '二', '三', '四', '五', '六'][d.getDay()], hours: minutes / 60 })
			}
			return days
		},
		abnormalTip() {
			const recent = this.store.stoolRecords.slice(-3)
			if (!recent.length) return ''
			const hasAbnormal = recent.some((r) => ['稀水样', '血丝', '黏液', '绿色'].includes(r.trait))
			if (hasAbnormal) return '近期出现异常性状，建议观察记录'
			return ''
		}
	},
	watch: {
		'store.activeSleep'() {
			this.toggleTicker()
		},
		'store.feedingTimer.running'() {
			this.toggleTicker()
		}
	},
	mounted() {
		this.store.initData()
		this.toggleTicker()
	},
	onUnload() {
		if (this._ticker) clearInterval(this._ticker)
	},
	methods: {
		switchTab(tab) {
			this.store.switchRecordTab(tab)
		},
		toggleTicker() {
			const running = !!(this.store.activeSleep || this.store.feedingTimer.running)
			if (this._ticker) {
				clearInterval(this._ticker)
				this._ticker = null
			}
			if (running) {
				this._ticker = setInterval(() => {
					this.nowTick = Date.now()
				}, 1000)
			}
		},
		fmtTime(ts) {
			return fmtTime(new Date(ts))
		},
		fmtDuration(start, end) {
			const min = diffMinutes(start, end)
			const h = Math.floor(min / 60)
			const m = min % 60
			return h > 0 ? `${h} 小时 ${m} 分钟` : `${m} 分钟`
		},
		// 睡眠
		startSleep() {
			this.nightWakes = 0
			this.store.startSleep()
			this.toggleTicker()
		},
		stopSleep() {
			this.store.stopSleep({ nightWakes: this.nightWakes })
			this.toggleTicker()
			uni.showToast({ title: '已保存睡眠记录', icon: 'success' })
		},
		removeSleep(id) {
			this.store.removeSleep(id)
		},
		// 喂奶
		startFeeding(side) {
			this.store.startFeeding(side)
			this.toggleTicker()
		},
		stopFeeding() {
			const r = this.store.stopBreastFeeding()
			this.toggleTicker()
			uni.showToast({ title: `已记录 ${r.breastMinutes} 分钟`, icon: 'success' })
		},
		openFormulaModal() {
			this.formulaMl = ''
			this.showFormulaModal = true
		},
		saveFormula() {
			if (!this.formulaMl || Number(this.formulaMl) <= 0) {
				uni.showToast({ title: '请输入奶量', icon: 'none' })
				return
			}
			this.store.addFormulaFeeding(this.formulaMl)
			this.showFormulaModal = false
			uni.showToast({ title: `已记录 ${this.formulaMl} ml`, icon: 'success' })
		},
		removeFeeding(id) {
			this.store.removeFeeding(id)
		},
		// 便便
		saveStool() {
			this.store.addStool({ trait: this.selectedTrait, amount: this.selectedAmount, note: this.stoolNote })
			this.stoolNote = ''
			uni.showToast({ title: '已保存排便记录', icon: 'success' })
		},
		removeStool(id) {
			this.store.removeStool(id)
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

	.night-wakes {
		display: flex;
		align-items: center;
		margin: 20rpx 0 4rpx;
	}

	.nw-label {
		font-size: 24rpx;
		color: #6B5D52;
		margin-right: 20rpx;
	}

	.stepper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 40rpx;
		padding: 6rpx 12rpx;
	}

	.step-btn {
		width: 48rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border-radius: 50%;
		background: #EFEBFA;
		color: #7E6BC4;
		font-size: 30rpx;
		font-weight: 700;
	}

	.step-val {
		min-width: 60rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: 700;
		color: #3D3129;
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
		min-height: 6rpx;
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

	.empty-inline {
		font-size: 24rpx;
		color: #C9BCB2;
		text-align: center;
		padding: 24rpx 0;
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
		font-size: 26rpx;
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
		margin-left: 16rpx;
	}

	.qsub {
		display: block;
		font-size: 20rpx;
		font-weight: 400;
		opacity: 0.75;
		margin-top: 4rpx;
	}

	.feeding-timer {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		background: #FFF3EC;
		border-radius: 24rpx;
		padding: 24rpx 28rpx;
		margin: 16rpx 0 8rpx;
	}

	.ft-label {
		font-size: 24rpx;
		color: #FF7043;
		font-weight: 600;
	}

	.ft-time {
		font-size: 48rpx;
		font-weight: 700;
		color: #FF7043;
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
		font-size: 22rpx;
		color: #A0938A;
	}

	.rec-del {
		color: #D8CCC2;
		font-size: 26rpx;
		padding: 12rpx;
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

	.note-input {
		background: #FAF6F0;
		border-radius: 16rpx;
		padding: 18rpx 24rpx;
		font-size: 24rpx;
		margin-top: 8rpx;
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

	/* 弹窗 */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(61, 49, 41, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.modal {
		width: 620rpx;
		background: #fff;
		border-radius: 36rpx;
		padding: 40rpx;
	}

	.modal-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #3D3129;
		margin-bottom: 28rpx;
	}

	.field {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.field-label {
		width: 120rpx;
		font-size: 26rpx;
		color: #8A7C71;
	}

	.field-input {
		flex: 1;
		background: #FAF6F0;
		border-radius: 16rpx;
		padding: 18rpx 24rpx;
		font-size: 30rpx;
	}

	.field-unit {
		font-size: 26rpx;
		color: #8A7C71;
		margin-left: 16rpx;
	}

	.modal-btns {
		display: flex;
	}

	.modal-btn {
		flex: 1;
		text-align: center;
		padding: 22rpx 0;
		border-radius: 24rpx;
		font-size: 28rpx;
		font-weight: 600;
	}

	.modal-btn.cancel {
		background: #F5EEE6;
		color: #8A7C71;
		margin-right: 20rpx;
	}

	.modal-btn.confirm {
		background: #FF8A65;
		color: #fff;
	}
</style>
