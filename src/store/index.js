import { defineStore } from 'pinia'
import { load, save } from '@/utils/storage.js'
import { buildPlan, nextCheckup } from '@/utils/checkup.js'
import { genId, nowTs, diffMinutes, startOfToday, isToday } from '@/utils/date.js'

/**
 * ParentPal 全局状态（Pinia）
 * 数据层：本地存储（uni.setStorageSync）+ 内存态，后续可叠加云同步
 */
export const useAppStore = defineStore('app', {
	state: () => ({
		// 当前宝宝档案
		baby: {
			name: '小糯米',
			gender: '男',
			birthday: '2026-05-01',
			ageText: ''
		},
		// 记录页当前分段：sleep | feed | stool
		activeRecordTab: 'sleep',
		// 三类记录（按时间正序）
		sleepRecords: [],
		feedingRecords: [],
		stoolRecords: [],
		// 体检状态 { [stageKey]: { status, date, note } }
		checkupStates: {},
		// 母乳计时器 { running, startTs, side }
		feedingTimer: { running: false, startTs: null, side: 'left' },
		// 进行中的睡眠记录 { startTs } | null
		activeSleep: null,
		// 数据是否已加载
		loaded: false
	}),

	getters: {
		/** 完整体检计划（由生日推算） */
		checkupPlan() {
			return buildPlan(this.baby.birthday)
		},
		/** 下一个待体检阶段 */
		nextCheckup() {
			return nextCheckup(this.baby.birthday, this.checkupStates)
		},
		/** 今日统计 */
		todayStats() {
			const dayStart = startOfToday()
			const sleeps = this.sleepRecords.filter((r) => r.start >= dayStart && r.end)
			const feeds = this.feedingRecords.filter((r) => r.time >= dayStart)
			const stools = this.stoolRecords.filter((r) => r.time >= dayStart)
			const sleepMinutes = sleeps.reduce((sum, r) => sum + diffMinutes(r.start, r.end), 0)
			const feedVolume = feeds.reduce((sum, r) => sum + (r.volumeMl || 0), 0)
			const nightSleeps = sleeps.filter((r) => new Date(r.start).getHours() >= 18 || new Date(r.start).getHours() < 6)
			return {
				sleepMinutes,
				sleepCount: sleeps.length,
				nightSleepCount: nightSleeps.length,
				feedCount: feeds.length,
				feedVolume,
				stoolCount: stools.length,
				lastFeedTime: this.feedingRecords.length ? this.feedingRecords[this.feedingRecords.length - 1].time : null
			}
		},
		/** 今日睡眠记录 */
		todaySleeps() {
			const dayStart = startOfToday()
			return this.sleepRecords.filter((r) => r.start >= dayStart)
		},
		/** 今日喂奶记录 */
		todayFeeds() {
			const dayStart = startOfToday()
			return this.feedingRecords.filter((r) => r.time >= dayStart)
		},
		/** 今日排便记录 */
		todayStools() {
			const dayStart = startOfToday()
			return this.stoolRecords.filter((r) => r.time >= dayStart)
		}
	},

	actions: {
		/** 启动时加载本地数据 */
		initData() {
			if (this.loaded) return
			const baby = load('baby', null)
			if (baby) this.baby = { ...this.baby, ...baby }
			this.sleepRecords = load('sleep', [])
			this.feedingRecords = load('feeding', [])
			this.stoolRecords = load('stool', [])
			this.checkupStates = load('checkupStates', {})
			this.loaded = true
		},

		/** 更新宝宝档案 */
		updateBaby(patch) {
			this.baby = { ...this.baby, ...patch }
			save('baby', this.baby)
		},

		// ---------- 睡眠 ----------
		startSleep() {
			if (this.activeSleep) return
			this.activeSleep = { startTs: nowTs() }
		},
		stopSleep(payload = {}) {
			if (!this.activeSleep) return null
			const record = {
				id: genId(),
				babyId: 'default',
				start: this.activeSleep.startTs,
				end: nowTs(),
				nightWakes: payload.nightWakes || 0,
				method: payload.method || ''
			}
			this.sleepRecords.push(record)
			this.activeSleep = null
			save('sleep', this.sleepRecords)
			return record
		},
		removeSleep(id) {
			this.sleepRecords = this.sleepRecords.filter((r) => r.id !== id)
			save('sleep', this.sleepRecords)
		},

		// ---------- 喂奶 ----------
		startFeeding(side) {
			this.feedingTimer = { running: true, startTs: nowTs(), side: side || 'left' }
		},
		stopBreastFeeding() {
			if (!this.feedingTimer.running) return null
			const minutes = diffMinutes(this.feedingTimer.startTs, nowTs())
			const record = {
				id: genId(),
				babyId: 'default',
				type: 'breast',
				side: this.feedingTimer.side,
				breastMinutes: minutes,
				time: nowTs()
			}
			this.feedingRecords.push(record)
			this.feedingTimer = { running: false, startTs: null, side: 'left' }
			save('feeding', this.feedingRecords)
			return record
		},
		addFormulaFeeding(volumeMl) {
			const record = {
				id: genId(),
				babyId: 'default',
				type: 'formula',
				volumeMl: Number(volumeMl) || 0,
				time: nowTs()
			}
			this.feedingRecords.push(record)
			save('feeding', this.feedingRecords)
			return record
		},
		removeFeeding(id) {
			this.feedingRecords = this.feedingRecords.filter((r) => r.id !== id)
			save('feeding', this.feedingRecords)
		},

		// ---------- 排便 ----------
		addStool(payload) {
			const record = {
				id: genId(),
				babyId: 'default',
				time: nowTs(),
				trait: payload.trait,
				amount: payload.amount,
				note: payload.note || ''
			}
			this.stoolRecords.push(record)
			save('stool', this.stoolRecords)
			return record
		},
		removeStool(id) {
			this.stoolRecords = this.stoolRecords.filter((r) => r.id !== id)
			save('stool', this.stoolRecords)
		},

		// ---------- 体检 ----------
		setCheckupState(stageKey, state) {
			this.checkupStates = { ...this.checkupStates, [stageKey]: state }
			save('checkupStates', this.checkupStates)
		},
		removeCheckupState(stageKey) {
			const states = { ...this.checkupStates }
			delete states[stageKey]
			this.checkupStates = states
			save('checkupStates', this.checkupStates)
		},

		// ---------- 通用 ----------
		switchRecordTab(tab) {
			this.activeRecordTab = tab
		}
	}
})
