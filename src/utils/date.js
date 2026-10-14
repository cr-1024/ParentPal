/**
 * ParentPal 日期工具
 * 统一使用本地时间；存储用 'YYYY-MM-DD' / 'YYYY-MM-DD HH:mm' 字符串或时间戳
 */

export function pad2(n) {
	return n < 10 ? '0' + n : '' + n
}

/** Date → 'YYYY-MM-DD' */
export function fmtDate(d) {
	return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** Date → 'HH:mm' */
export function fmtTime(d) {
	return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

/** Date → 'YYYY-MM-DD HH:mm' */
export function fmtDateTime(d) {
	return `${fmtDate(d)} ${fmtTime(d)}`
}

/** 'YYYY-MM-DD' → Date（本地 00:00） */
export function parseDate(str) {
	const [y, m, d] = str.split('-').map(Number)
	return new Date(y, m - 1, d)
}

/** 'YYYY-MM-DD HH:mm' → Date */
export function parseDateTime(str) {
	const [datePart, timePart] = str.split(' ')
	const d = parseDate(datePart)
	if (timePart) {
		const [h, mi] = timePart.split(':').map(Number)
		d.setHours(h, mi, 0, 0)
	}
	return d
}

export function nowTs() {
	return Date.now()
}

export function addDays(date, n) {
	const d = new Date(date)
	d.setDate(d.getDate() + n)
	return d
}

export function addMonths(date, n) {
	const d = new Date(date)
	const day = d.getDate()
	d.setDate(1)
	d.setMonth(d.getMonth() + n)
	// 处理 31 日加月溢出（如 1/31 + 1 月 → 3/3），回退到月末
	const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
	d.setDate(Math.min(day, lastDay))
	return d
}

/** 两个时间相差分钟数（b - a） */
export function diffMinutes(a, b) {
	return Math.round((b - a) / 60000)
}

/** 今天 00:00 的时间戳 */
export function startOfToday() {
	const d = new Date()
	d.setHours(0, 0, 0, 0)
	return d.getTime()
}

/** 时间戳是否属于今天 */
export function isToday(ts) {
	return ts >= startOfToday()
}

/** 分钟数 → 'X 小时 Y 分钟' */
export function fmtDuration(minutes) {
	const h = Math.floor(minutes / 60)
	const m = Math.round(minutes % 60)
	if (h > 0) return `${h} 小时 ${m} 分钟`
	return `${m} 分钟`
}

/**
 * 由生日计算月龄文本，如 '5 个月 12 天'
 */
export function ageText(birthdayStr) {
	const birth = parseDate(birthdayStr)
	const now = new Date()
	let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
	if (now.getDate() < birth.getDate()) months -= 1
	if (months < 0) months = 0
	// 满月当天的日期
	const monthDate = addMonths(birth, months)
	const days = Math.max(0, Math.floor((now - monthDate) / 86400000))
	if (months === 0) return `${days} 天`
	return `${months} 个月 ${days} 天`
}

/** 由生日计算整月龄 */
export function ageMonths(birthdayStr) {
	const birth = parseDate(birthdayStr)
	const now = new Date()
	let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
	if (now.getDate() < birth.getDate()) months -= 1
	return Math.max(0, months)
}

/** 生成记录 id */
export function genId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
