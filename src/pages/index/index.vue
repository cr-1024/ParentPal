<template>
	<view class="page">
		<view class="page-title">早上好，宝妈<text class="sub">今天也要科学养娃</text></view>

		<!-- 宝宝卡片（点击编辑档案） -->
		<view class="card baby-card" @click="openBabyEdit">
			<view class="avatar">👶</view>
			<view class="baby-info">
				<view class="baby-name">{{ store.baby.name }}</view>
				<view class="baby-meta">{{ store.baby.gender }} · 今天 {{ ageText }} · {{ store.baby.birthday }} 出生</view>
			</view>
			<view class="edit-hint">编辑 ›</view>
		</view>

		<!-- 今日提醒（真实数据驱动） -->
		<view class="card reminder" v-if="reminders.length">
			<view class="reminder-row" v-for="(r, i) in reminders" :key="i">
				<view class="r-icon" :class="r.type">{{ r.type === 'checkup' ? '💉' : (r.type === 'sleep' ? '😴' : '🍼') }}</view>
				<view class="r-text">
					<text class="b">{{ r.title }}</text>
					<text class="r-sub">{{ r.message }}</text>
				</view>
				<text class="r-time" v-if="r.level === 'warn'">尽快处理</text>
			</view>
		</view>
		<view class="card empty" v-else>
			<view class="empty-emoji">🌤️</view>
			<view class="empty-text">今天没有待办提醒，享受轻松的一天</view>
		</view>

		<!-- 今日概览 -->
		<view class="grid">
			<view class="stat">
				<view class="t">😴 今日睡眠</view>
				<view class="v">{{ stats.sleepHours }} <text class="u">小时 · {{ stats.sleepCount }} 次</text></view>
			</view>
			<view class="stat">
				<view class="t">🍼 今日喂奶</view>
				<view class="v">{{ stats.feedCount }} 次 <text class="u" v-if="stats.feedVolume">/ {{ stats.feedVolume }} ml</text></view>
			</view>
			<view class="stat">
				<view class="t">💩 今日便便</view>
				<view class="v">{{ stats.stoolCount }} <text class="u">次</text></view>
			</view>
			<view class="stat">
				<view class="t">💉 下次体检</view>
				<view class="v">{{ next ? next.daysAway + ' 天' : '—' }} <text class="u">{{ next ? next.label : '0-3 岁计划已完成' }}</text></view>
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

		<!-- 宝宝档案编辑弹窗 -->
		<view class="modal-mask" v-if="showBabyEdit" @click="closeBabyEdit">
			<view class="modal" @click.stop>
				<view class="modal-title">编辑宝宝档案</view>
				<view class="field">
					<text class="field-label">昵称</text>
					<input class="field-input" v-model="editForm.name" placeholder="宝宝昵称" />
				</view>
				<view class="field">
					<text class="field-label">性别</text>
					<view class="gender-opts">
						<view :class="['gender-opt', { on: editForm.gender === '男' }]" @click="editForm.gender = '男'">男</view>
						<view :class="['gender-opt', { on: editForm.gender === '女' }]" @click="editForm.gender = '女'">女</view>
					</view>
				</view>
				<view class="field">
					<text class="field-label">出生日期</text>
					<picker mode="date" :value="editForm.birthday" @change="onBirthdayChange">
						<view class="picker-value">{{ editForm.birthday }} 📅</view>
					</picker>
				</view>
				<view class="modal-note">生日决定体检计划、喂奶间隔与睡眠建议，请填写准确</view>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="closeBabyEdit">取消</view>
					<view class="modal-btn confirm" @click="saveBabyEdit">保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useAppStore } from '@/store/index.js'
import { getDueReminders } from '@/utils/reminder.js'
import { ageText } from '@/utils/date.js'

export default {
	data() {
		return {
			showBabyEdit: false,
			editForm: { name: '', gender: '男', birthday: '' }
		}
	},
	computed: {
		store() {
			return useAppStore()
		},
		ageText() {
			return ageText(this.store.baby.birthday)
		},
		reminders() {
			return getDueReminders({
				baby: this.store.baby,
				sleepRecords: this.store.sleepRecords,
				feedingRecords: this.store.feedingRecords,
				nextCheckup: this.store.nextCheckup
			})
		},
		next() {
			return this.store.nextCheckup
		},
		stats() {
			const s = this.store.todayStats
			return {
				sleepHours: (s.sleepMinutes / 60).toFixed(1),
				sleepCount: s.sleepCount,
				feedCount: s.feedCount,
				feedVolume: s.feedVolume,
				stoolCount: s.stoolCount
			}
		}
	},
	onShow() {
		this.store.initData()
	},
	methods: {
		goRecord(tab) {
			this.store.switchRecordTab(tab)
			uni.switchTab({ url: '/pages/records/index' })
		},
		goGrowth() {
			uni.switchTab({ url: '/pages/growth/index' })
		},
		openBabyEdit() {
			const b = this.store.baby
			this.editForm = { name: b.name, gender: b.gender, birthday: b.birthday }
			this.showBabyEdit = true
		},
		closeBabyEdit() {
			this.showBabyEdit = false
		},
		onBirthdayChange(e) {
			this.editForm.birthday = e.detail.value
		},
		saveBabyEdit() {
			this.store.updateBaby({ ...this.editForm })
			this.showBabyEdit = false
			uni.showToast({ title: '已保存', icon: 'success' })
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

	.baby-info {
		flex: 1;
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

	.edit-hint {
		font-size: 24rpx;
		color: #C68B5E;
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
		background: #FFEDE4;
	}

	.r-icon.sleep {
		background: #EFEBFA;
	}

	.r-icon.checkup {
		background: #E6F4E8;
	}

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
		font-size: 22rpx;
		white-space: nowrap;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48rpx 32rpx;
	}

	.empty-emoji {
		font-size: 56rpx;
	}

	.empty-text {
		font-size: 24rpx;
		color: #A0938A;
		margin-top: 12rpx;
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
		width: 140rpx;
		font-size: 26rpx;
		color: #8A7C71;
	}

	.field-input {
		flex: 1;
		background: #FAF6F0;
		border-radius: 16rpx;
		padding: 18rpx 24rpx;
		font-size: 26rpx;
	}

	.gender-opts {
		flex: 1;
		display: flex;
	}

	.gender-opt {
		padding: 12rpx 40rpx;
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
		font-size: 26rpx;
		color: #3D3129;
	}

	.modal-note {
		font-size: 20rpx;
		color: #C9BCB2;
		line-height: 1.6;
		margin-bottom: 28rpx;
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
