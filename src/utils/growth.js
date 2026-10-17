/**
 * ParentPal 成长曲线
 * 参考 WHO 男童体重近似值（P3 / P50），女童整体略低，仅供趋势参考
 */

import { parseDate } from './date.js'

/** WHO 体重参考近似值（kg）：month → { p3, p50 } */
const WEIGHT_REF = [
	{ month: 0, p3: 2.5, p50: 3.3 },
	{ month: 1, p3: 3.2, p50: 4.2 },
	{ month: 2, p3: 3.9, p50: 5.1 },
	{ month: 3, p3: 4.5, p50: 6.0 },
	{ month: 4, p3: 5.0, p50: 6.7 },
	{ month: 5, p3: 5.4, p50: 7.3 },
	{ month: 6, p3: 5.7, p50: 7.9 },
	{ month: 8, p3: 6.3, p50: 8.6 },
	{ month: 9, p3: 6.6, p50: 9.0 },
	{ month: 10, p3: 6.8, p50: 9.3 },
	{ month: 12, p3: 7.1, p50: 9.6 },
	{ month: 15, p3: 7.7, p50: 10.3 },
	{ month: 18, p3: 8.1, p50: 10.9 },
	{ month: 21, p3: 8.5, p50: 11.5 },
	{ month: 24, p3: 8.8, p50: 12.2 },
	{ month: 30, p3: 9.2, p50: 13.3 },
	{ month: 36, p3: 9.7, p50: 14.3 }
]

/** 线性插值取参考值 */
export function interpRef(month) {
	const list = WEIGHT_REF
	if (month <= list[0].month) return { ...list[0] }
	if (month >= list[list.length - 1].month) return { ...list[list.length - 1] }
	for (let i = 1; i < list.length; i++) {
		if (month <= list[i].month) {
			const a = list[i - 1]
			const b = list[i]
			const t = (month - a.month) / (b.month - a.month)
			return {
				month,
				p3: a.p3 + (b.p3 - a.p3) * t,
				p50: a.p50 + (b.p50 - a.p50) * t
			}
		}
	}
	return { ...list[list.length - 1] }
}

/** 两个日期之间的月龄（保留 1 位小数） */
export function monthsBetween(birthdayStr, dateStr) {
	const birth = parseDate(birthdayStr).getTime()
	const d = parseDate(dateStr).getTime()
	if (d <= birth) return 0
	const months = (d - birth) / (365.25 / 12 * 86400000)
	return Math.round(months * 10) / 10
}

/**
 * 由成长记录构建图表数据
 * @param {object} baby 宝宝档案（含 birthday、birthWeight）
 * @param {Array} growthRecords 成长记录（date/weight）
 * @returns {{ categories, baby, p50, p3, hasData }}
 */
export function buildGrowthSeries(baby, growthRecords) {
	const points = []
	if (baby && baby.birthWeight && Number(baby.birthWeight) > 0) {
		points.push({ month: 0, weight: Number(baby.birthWeight) })
	}
	;(growthRecords || []).forEach((r) => {
		if (r.weight && Number(r.weight) > 0) {
			points.push({ month: monthsBetween(baby.birthday, r.date), weight: Number(r.weight) })
		}
	})
	points.sort((a, b) => a.month - b.month)
	// 同月龄只保留最后一次
	const dedup = []
	points.forEach((p) => {
		const idx = dedup.findIndex((x) => x.month === p.month)
		if (idx >= 0) dedup[idx] = p
		else dedup.push(p)
	})
	return {
		categories: dedup.map((p) => p.month + '月'),
		baby: dedup.map((p) => p.weight),
		p50: dedup.map((p) => Number(interpRef(p.month).p50.toFixed(1))),
		p3: dedup.map((p) => Number(interpRef(p.month).p3.toFixed(1))),
		hasData: dedup.length >= 2
	}
}
