import { defineStore } from 'pinia'

/**
 * ParentPal 全局状态（Pinia）
 * 说明：uni-app 模板锁定 Vue 3.4，故使用 pinia@2.1.7（peer 兼容 vue ^3.3.0）。
 */
export const useAppStore = defineStore('app', {
	state: () => ({
		// 当前宝宝档案（M1 阶段为演示数据，后续接本地存储/云同步）
		baby: {
			name: '小糯米',
			gender: '男',
			birthday: '2026-05-01',
			ageText: '5 个月 12 天'
		},
		// 记录页当前分段：sleep | feed | stool
		activeRecordTab: 'sleep'
	}),
	actions: {
		setActiveRecordTab(tab) {
			this.activeRecordTab = tab
		}
	}
})
