/**
 * ParentPal 提醒引擎
 *
 * 平台能力说明：
 * - App 端（APP-PLUS）：支持本地推送通知（plus.push.createMessage），可靠定时提醒
 * - 小程序端：仅支持订阅消息（需用户授权、有时效限制），M2 实现；当前为静默
 * - 桌面端：不承担提醒职责
 *
 * 所有端通用的能力：打开 App / 回到前台时计算到期提醒（getDueReminders）
 */

import { ageMonths, diffMinutes } from './date.js'

/** 喂奶间隔表（月龄 → 小时），取不大于当前月龄的最大一档 */
const FEED_INTERVAL_HOURS = [
	[0, 2.5],
	[3, 3.5],
	[6, 3.5],
	[9, 4],
	[12, 4.5]
]

/** 清醒间隔表（月龄 → 小时） */
const AWAKE_WINDOW_HOURS = [
	[0, 1.5],
	[4, 2],
	[6, 2.5],
	[9, 3],
	[12, 3.5],
	[18, 4],
	[24, 5]
]

function lookup(table, months) {
	let result = table[0][1]
	for (const [m, v] of table) {
		if (months >= m) result = v
	}
	return result
}

export function feedIntervalHours(birthdayStr) {
	return lookup(FEED_INTERVAL_HOURS, ageMonths(birthdayStr))
}

export function awakeWindowHours(birthdayStr) {
	return lookup(AWAKE_WINDOW_HOURS, ageMonths(birthdayStr))
}

/**
 * 计算当前到期的提醒列表
 * @param {object} ctx { baby, sleepRecords, feedingRecords, nextCheckup }
 * @returns {Array<{type, title, message, level}>} level: 'normal' | 'warn'
 */
export function getDueReminders(ctx) {
	const { baby, sleepRecords = [], feedingRecords = [], nextCheckup: next } = ctx || {}
	const reminders = []

	// 1. 喂奶提醒
	if (feedingRecords.length > 0) {
		const last = feedingRecords[feedingRecords.length - 1]
		const elapsedMin = diffMinutes(last.time, Date.now())
		const intervalMin = feedIntervalHours(baby.birthday) * 60
		if (elapsedMin >= intervalMin) {
			reminders.push({
				type: 'feed',
				title: '喂奶时间到',
				message: `距上次喂奶已 ${Math.floor(elapsedMin / 60)} 小时 ${elapsedMin % 60} 分钟（建议间隔 ${feedIntervalHours(baby.birthday)} 小时）`,
				level: elapsedMin >= intervalMin * 1.5 ? 'warn' : 'normal'
			})
		}
	}

	// 2. 哄睡提醒（清醒间隔）
	const lastSleepEnd = getLastSleepEnd(sleepRecords)
	if (lastSleepEnd) {
		const awakeMin = diffMinutes(lastSleepEnd, Date.now())
		const windowMin = awakeWindowHours(baby.birthday) * 60
		if (awakeMin >= windowMin) {
			reminders.push({
				type: 'sleep',
				title: '该哄睡啦',
				message: `已清醒 ${Math.floor(awakeMin / 60)} 小时 ${awakeMin % 60} 分钟，超过 ${awakeWindowHours(baby.birthday)} 小时的月龄建议上限`,
				level: awakeMin >= windowMin * 1.3 ? 'warn' : 'normal'
			})
		}
	}

	// 3. 体检提醒（提前 7 天 / 1 天）
	if (next && next.daysAway >= 0 && next.daysAway <= 7) {
		reminders.push({
			type: 'checkup',
			title: `${next.label}临近`,
			message: next.daysAway === 0
				? '就是今天，记得带齐疫苗本和资料'
				: `还有 ${next.daysAway} 天（${next.date}），可提前预约`,
			level: next.daysAway <= 1 ? 'warn' : 'normal'
		})
	}

	return reminders
}

/** 最近一次睡眠记录的结束时间（无结束时间视为进行中，返回 null） */
export function getLastSleepEnd(sleepRecords) {
	for (let i = sleepRecords.length - 1; i >= 0; i--) {
		const r = sleepRecords[i]
		if (r.end) return r.end
	}
	return null
}

/**
 * 发送本地通知（仅 App 端生效，其余端静默降级）
 */
export function notifyLocal(title, content) {
	// #ifdef APP-PLUS
	try {
		if (typeof plus !== 'undefined' && plus.push && plus.push.createMessage) {
			plus.push.createMessage(content, '', { title })
		}
	} catch (e) {
		console.warn('[reminder] local notification failed', e)
	}
	// #endif
	// #ifndef APP-PLUS
	// 小程序订阅消息（M2）/ 桌面端：暂不弹通知
	// #endif
}
