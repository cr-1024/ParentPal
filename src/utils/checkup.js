/**
 * ParentPal 体检计划
 * 依据国家基本公共卫生服务规范（0-6 岁儿童健康管理），覆盖 0-3 岁
 */

import { addDays, addMonths, fmtDate, parseDate, diffMinutes } from './date.js'

/**
 * 体检阶段表
 * month: 月龄（0 = 新生儿期）；dayOffset: 出生后第几天（仅新生儿访视用）
 * scope: 检查范围分类；items: 考察项目清单；extra: 该月龄专项检查
 */
export const CHECKUP_STAGES = [
	{
		key: 'newborn-visit',
		label: '新生儿访视',
		month: 0,
		dayOffset: 7,
		scope: ['体格测量：身长 / 体重', '体格检查：皮肤黄染 / 脐带 / 心肺 / 腹部', '喂养情况评估', '黄疸与体温监测'],
		items: ['出生体重与身长记录', '脐带残端是否脱落干燥', '皮肤黄染程度', '吸吮与喂养次数', '大小便次数与性状'],
		extra: '出院后 1 周内由社区医生上门访视'
	},
	{
		key: 'month1',
		label: '满月体检',
		month: 1,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部 / 髋关节', '神经心理发育粗查', '喂养与维生素 D 补充指导'],
		items: ['体重增长是否达标', '头围测量', '脐带完全脱落', '俯卧抬头反应', '母乳/奶粉喂养量评估', '维生素 D 补充情况'],
		extra: '建议同时评估黄疸消退情况'
	},
	{
		key: 'm3',
		label: '3 月龄体检',
		month: 3,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部 / 髋关节', '发育评估：大运动 / 精细 / 语言 / 社交', '喂养指导'],
		items: ['俯卧抬头 45°-90°', '双手握持与看手', '咿呀发声 / 笑出声', '追视红球或人脸', '髋关节筛查'],
		extra: ''
	},
	{
		key: 'm6',
		label: '6 月龄体检',
		month: 6,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部 / 牙齿萌出', '发育评估：翻身 / 坐 / 抓握 / 发音', '辅食添加指导', '血常规'],
		items: ['翻身与扶坐', '主动够物抓握', '叫名字有反应', '辅食添加时机评估', '血红蛋白检测', '听力行为观察'],
		extra: '部分社区在此月龄安排听力行为观察'
	},
	{
		key: 'm8',
		label: '8 月龄体检',
		month: 8,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部', '发育评估：独坐 / 爬行 / 精细 / 语言', '营养与喂养指导'],
		items: ['独坐稳与翻身', '拇食指捏取', '无意识叫爸妈', '认生与模仿', '辅食性状过渡'],
		extra: ''
	},
	{
		key: 'm12',
		label: '12 月龄体检',
		month: 12,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部 / 牙齿', '发育评估：站 / 走 / 语言 / 社交', '血常规'],
		items: ['扶站扶走', '有意识叫爸妈', '指认身体部位', '拇食指对捏', '血红蛋白检测'],
		extra: '周岁里程碑综合评估'
	},
	{
		key: 'm18',
		label: '18 月龄体检',
		month: 18,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部 / 牙齿', '发育评估：独走 / 语言 / 社交', '血红蛋白'],
		items: ['独走稳', '说 10 个以上单词', '用勺子吃饭', '搭积木 2-4 块', '血红蛋白检测'],
		extra: '语言发育重点关注月龄'
	},
	{
		key: 'm24',
		label: '24 月龄体检',
		month: 24,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部 / 牙齿', '发育评估：跑跳 / 语言 / 社交'],
		items: ['跑与踢球', '说简单句子', '模仿大人做事', '如厕训练迹象', '牙齿数与龋齿检查'],
		extra: ''
	},
	{
		key: 'm30',
		label: '30 月龄体检',
		month: 30,
		scope: ['体格测量：身长 / 体重', '体格检查：心肺 / 腹部 / 牙齿', '发育评估：大运动 / 精细 / 语言 / 社交', '血常规'],
		items: ['双脚跳', '画圆形与线条', '说 3-5 字句子', '与同伴互动', '血红蛋白检测'],
		extra: ''
	},
	{
		key: 'm36',
		label: '36 月龄体检',
		month: 36,
		scope: ['体格测量：身长 / 体重 / 头围', '体格检查：心肺 / 腹部 / 牙齿', '发育评估：综合能力', '视力筛查'],
		items: ['单脚站与攀爬', '复杂语言表达', '画人像雏形', '视力筛查', '龋齿与咬合检查'],
		extra: '入园前综合评估，含视力筛查'
	}
]

/** 计算某阶段的目标体检日期 */
export function stageDate(birthdayStr, stage) {
	const birth = parseDate(birthdayStr)
	if (stage.dayOffset) return addDays(birth, stage.dayOffset)
	return addMonths(birth, stage.month)
}

/** 由生日生成完整体检计划（含目标日期） */
export function buildPlan(birthdayStr) {
	return CHECKUP_STAGES.map((s) => ({
		...s,
		date: fmtDate(stageDate(birthdayStr, s))
	}))
}

/**
 * 找出下一个待体检阶段（未完成、未跳过）
 * @returns {object|null} 阶段 + 距今天数
 */
export function nextCheckup(birthdayStr, states) {
	const plan = buildPlan(birthdayStr)
	for (const stage of plan) {
		const st = states[stage.key]
		if (st && (st.status === 'done' || st.status === 'skipped')) continue
		const days = diffMinutes(Date.now(), parseDate(stage.date).getTime()) / (24 * 60)
		return { ...stage, daysAway: Math.round(days) }
	}
	return null
}
