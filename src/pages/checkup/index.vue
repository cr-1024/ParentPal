<template>
	<view class="page">
		<view class="page-title">发育体检<text class="sub">0-3 岁全周期计划</text></view>

		<!-- 下次体检 -->
		<view class="card next-card" v-if="next">
			<view class="next-head">
				<view>
					<view class="next-label">下次体检{{ nextState && nextState.status === 'booked' ? ' · 已预约' : '' }}</view>
					<view class="next-title">{{ next.label }}</view>
					<view class="next-date">{{ next.date }} · {{ next.daysAway >= 0 ? `倒计时 ${next.daysAway} 天` : `已超期 ${-next.daysAway} 天` }}</view>
				</view>
				<view class="next-icon">💉</view>
			</view>
			<view class="btn-primary" @click="toggleScope">{{ showScope ? '收起检查项目' : `查看本次检查项目（${next.items.length} 项）` }}</view>
			<view class="btn-outline" v-if="!nextState || nextState.status !== 'booked'" @click="markBooked">标记为已预约</view>
			<view class="btn-outline done" v-else @click="markDone(next.key)">本次已完成</view>

			<!-- 检查项目详情 -->
			<view class="scope-detail" v-if="showScope">
				<view class="detail-title">检查范围</view>
				<view class="detail-item" v-for="(s, i) in next.scope" :key="i">· {{ s }}</view>
				<view class="detail-title mt">考察项目（家长自查预习）</view>
				<view class="detail-item" v-for="(it, i) in next.items" :key="i">☐ {{ it }}</view>
				<view class="detail-extra" v-if="next.extra">💡 {{ next.extra }}</view>
				<view class="note">* 具体项目按当地社区医院与医嘱执行，提前 7 天 / 1 天提醒</view>
			</view>
		</view>

		<view class="card empty" v-else>
			<view class="empty-emoji">🎉</view>
			<view class="empty-text">0-3 岁体检计划已全部完成</view>
		</view>

		<!-- 成长曲线（图表库接入点） -->
		<view class="card">
			<view class="sec-title">成长曲线 · 体重</view>
			<view class="chart-placeholder">
				<text class="chart-emoji">📈</text>
				<text class="chart-tip">ucharts 成长曲线接入点</text>
			</view>
			<view class="chart-desc">在体检结果中记录身长体重后绘制</view>
		</view>

		<!-- 体检时间轴 -->
		<view class="card">
			<view class="sec-title">体检时间轴（点击更新状态）</view>
			<view class="tl">
				<view class="tl-item" v-for="s in plan" :key="s.key"
					:class="{ done: stateOf(s.key) && stateOf(s.key).status === 'done', skipped: stateOf(s.key) && stateOf(s.key).status === 'skipped', next: next && s.key === next.key }"
					@click="openStageActions(s)">
					<text class="tl-name">{{ s.label }}</text>
					<text class="tl-state">{{ stateText(s) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useAppStore } from '@/store/index.js'

export default {
	data() {
		return {
			showScope: false
		}
	},
	computed: {
		appStore() {
			return useAppStore()
		},
		plan() {
			return this.appStore.checkupPlan
		},
		next() {
			return this.appStore.nextCheckup
		},
		nextState() {
			return this.next ? this.appStore.checkupStates[this.next.key] : null
		}
	},
	onShow() {
		this.appStore.initData()
	},
	methods: {
		stateOf(key) {
			return this.appStore.checkupStates[key]
		},
		stateText(s) {
			const st = this.appStore.checkupStates[s.key]
			if (!st) return this.next && s.key === this.next.key ? '待体检' : '未到'
			if (st.status === 'done') return '✔ 已完成'
			if (st.status === 'booked') return '已预约'
			if (st.status === 'skipped') return '已跳过'
			return '未到'
		},
		toggleScope() {
			this.showScope = !this.showScope
		},
		markBooked() {
			this.appStore.setCheckupState(this.next.key, { status: 'booked', date: this.next.date, note: '' })
			uni.showToast({ title: '已标记预约', icon: 'success' })
		},
		markDone(key) {
			this.appStore.setCheckupState(key, { status: 'done', date: new Date().toISOString().slice(0, 10), note: '' })
			uni.showToast({ title: '已完成', icon: 'success' })
		},
		openStageActions(s) {
			const st = this.appStore.checkupStates[s.key]
			const itemList = ['标记为已预约', '标记为已完成', '标记为已跳过']
			if (st && st.status !== 'done') itemList.push('清除状态')
			uni.showActionSheet({
				itemList,
				success: (res) => {
					const idx = res.tapIndex
					if (idx === 0) {
						this.appStore.setCheckupState(s.key, { status: 'booked', date: s.date, note: '' })
					} else if (idx === 1) {
						this.appStore.setCheckupState(s.key, { status: 'done', date: new Date().toISOString().slice(0, 10), note: '' })
					} else if (idx === 2) {
						this.appStore.setCheckupState(s.key, { status: 'skipped', date: s.date, note: '' })
					} else if (idx === 3) {
						this.appStore.removeCheckupState(s.key)
					}
					uni.showToast({ title: '已更新', icon: 'success' })
				}
			})
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

	.btn-outline.done {
		background: #7BC47F;
		border-color: #7BC47F;
		color: #fff;
	}

	.scope-detail {
		background: rgba(255, 255, 255, 0.75);
		border-radius: 24rpx;
		padding: 24rpx 28rpx;
		margin-top: 24rpx;
	}

	.detail-title {
		font-size: 26rpx;
		font-weight: 700;
		color: #9C6B4E;
		margin-bottom: 8rpx;
	}

	.detail-title.mt {
		margin-top: 20rpx;
	}

	.detail-item {
		font-size: 24rpx;
		color: #6B5D52;
		line-height: 1.7;
	}

	.detail-extra {
		font-size: 22rpx;
		color: #C68B5E;
		margin-top: 16rpx;
		line-height: 1.6;
	}

	.note {
		font-size: 22rpx;
		color: #B5A79C;
		line-height: 1.6;
		margin-top: 16rpx;
	}

	.sec-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #3D3129;
		margin-bottom: 12rpx;
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

	.tl-item.skipped::before {
		background: #D8CCC2;
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
