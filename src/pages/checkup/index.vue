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
			<view class="btn-outline record" @click="toggleResultForm">{{ showResultForm ? '收起结果录入' : '记录本次体检结果' }}</view>
			<view class="btn-outline done" v-if="nextState && nextState.status === 'booked'" @click="markDone(next.key)">本次已完成（不录入数据）</view>

			<!-- 体检结果录入 -->
			<view class="result-form" v-if="showResultForm">
				<view class="detail-title">录入本次测量数据（选填，至少填一项）</view>
				<view class="field">
					<text class="field-label">身长</text>
					<input class="field-input" type="digit" v-model="resultForm.height" placeholder="cm" maxlength="5" />
					<text class="field-unit">cm</text>
				</view>
				<view class="field">
					<text class="field-label">体重</text>
					<input class="field-input" type="digit" v-model="resultForm.weight" placeholder="kg" maxlength="5" />
					<text class="field-unit">kg</text>
				</view>
				<view class="field">
					<text class="field-label">头围</text>
					<input class="field-input" type="digit" v-model="resultForm.headCircumference" placeholder="cm" maxlength="5" />
					<text class="field-unit">cm</text>
				</view>
				<view class="btn-primary save" @click="saveResult">保存并标记完成</view>
			</view>

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

		<!-- 成长曲线（ucharts） -->
		<view class="card">
			<view class="sec-title">成长曲线 · 体重（kg）</view>
			<view class="chart-box" v-if="growth.hasData">
				<pp-chart type="line" :chartData="growthChartData" :opts="growthChartOpts" :height="280" />
			</view>
			<view class="empty-inline" v-else>录入至少两次体检体重后，这里会绘制成长曲线</view>
			<view class="chart-desc" v-if="growth.hasData">实线为宝宝体重，虚线为 WHO 参考（P50 / P3 近似值）</view>
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
import ppChart from '@/components/pp-chart/pp-chart.vue'
import { buildGrowthSeries } from '@/utils/growth.js'

export default {
	components: { ppChart },
	data() {
		return {
			showScope: false,
			showResultForm: false,
			resultForm: { height: '', weight: '', headCircumference: '' }
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
		},
		growth() {
			return buildGrowthSeries(this.appStore.baby, this.appStore.growthRecords)
		},
		growthChartData() {
			return {
				categories: this.growth.categories,
				series: [
					{ name: '宝宝体重', data: this.growth.baby },
					{ name: 'P50 参考', data: this.growth.p50 },
					{ name: 'P3 参考', data: this.growth.p3 }
				]
			}
		},
		growthChartOpts() {
			return {
				color: ['#FF8A65', '#B8A6E8', '#D8CCC2'],
				padding: [15, 15, 0, 15],
				dataLabel: false,
				xAxis: { disableGrid: true },
				yAxis: {
					gridType: 'dash',
					dashLength: 2,
					data: { title: 'kg' }
				},
				legend: { show: true, position: 'bottom', lineHeight: 20 },
				extra: {
					line: {
						type: 'straight',
						width: 2,
						activeType: 'hollow',
						linearIndex: 1,
						dashType: [undefined, 'dash', 'dash']
					}
				}
			}
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
		toggleResultForm() {
			this.showResultForm = !this.showResultForm
		},
		saveResult() {
			if (!this.next) return
			const f = this.resultForm
			const hasData = (f.height && Number(f.height) > 0) || (f.weight && Number(f.weight) > 0) || (f.headCircumference && Number(f.headCircumference) > 0)
			if (!hasData) {
				uni.showToast({ title: '请至少填写一项测量数据', icon: 'none' })
				return
			}
			this.appStore.finishCheckup(this.next.key, { ...f })
			this.resultForm = { height: '', weight: '', headCircumference: '' }
			this.showResultForm = false
			uni.showToast({ title: '已归档体检结果', icon: 'success' })
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

	.chart-box {
		width: 100%;
		padding-top: 8rpx;
	}

	.empty-inline {
		font-size: 24rpx;
		color: #C9BCB2;
		text-align: center;
		padding: 32rpx 0;
	}

	.chart-desc {
		font-size: 22rpx;
		color: #8A7C71;
		margin-top: 12rpx;
	}

	/* 结果录入表单 */
	.result-form {
		background: rgba(255, 255, 255, 0.85);
		border-radius: 24rpx;
		padding: 24rpx 28rpx 8rpx;
		margin-top: 24rpx;
	}

	.field {
		display: flex;
		align-items: center;
		padding: 12rpx 0;
	}

	.field-label {
		width: 130rpx;
		font-size: 26rpx;
		color: #8A7C71;
	}

	.field-input {
		flex: 1;
		background: #FAF6F0;
		border-radius: 16rpx;
		padding: 16rpx 24rpx;
		font-size: 28rpx;
	}

	.field-unit {
		font-size: 24rpx;
		color: #8A7C71;
		margin-left: 16rpx;
	}

	.btn-primary.save {
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
