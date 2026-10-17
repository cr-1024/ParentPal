/**
 * ParentPal 本地存储封装
 * 统一管理存储 key，读写默认值，后续可无缝替换为云同步实现
 */

const KEYS = {
	baby: 'pp_baby',
	user: 'pp_user',
	sleep: 'pp_sleep_records',
	feeding: 'pp_feeding_records',
	stool: 'pp_stool_records',
	checkupStates: 'pp_checkup_states',
	growth: 'pp_growth_records'
}

export function load(key, defaultValue) {
	try {
		const val = uni.getStorageSync(KEYS[key])
		return val === '' || val === null || val === undefined ? defaultValue : val
	} catch (e) {
		console.error('[storage] load failed:', key, e)
		return defaultValue
	}
}

export function save(key, value) {
	try {
		uni.setStorageSync(KEYS[key], value)
		return true
	} catch (e) {
		console.error('[storage] save failed:', key, e)
		return false
	}
}

export default KEYS
