<template>
	<view class="pp-chart">
		<canvas
			:style="{ width: cWidth + 'px', height: cHeight + 'px' }"
			:canvas-id="canvasId"
			:id="canvasId"
			:disable-scroll="true"
			class="pp-canvas"
		></canvas>
	</view>
</template>

<script>
/**
 * ucharts 跨端封装组件
 * - 微信小程序：canvas type="2d" + SelectorQuery 取 node
 * - H5 / App：canvasId 模式（ucharts 内部走 uni.createCanvasContext）
 */
import UCharts from '@qiun/ucharts'

export default {
	name: 'pp-chart',
	props: {
		type: { type: String, default: 'column' },
		chartData: { type: Object, required: true },
		opts: { type: Object, default: () => ({}) },
		height: { type: Number, default: 220 }
	},
	data() {
		return {
			canvasId: 'ppc' + Math.random().toString(36).slice(2, 9),
			cWidth: 340,
			cHeight: this.height,
			chart: null
		}
	},
	watch: {
		chartData: {
			handler() {
				this.draw()
			},
			deep: true
		}
	},
	mounted() {
		// 画布宽度取父容器实际宽度
		this.createSelectorQuery()
			.select('.pp-chart')
			.boundingClientRect((rect) => {
				if (rect && rect.width) this.cWidth = rect.width
				this.draw()
			})
			.exec()
	},
	methods: {
		draw() {
			if (!this.chartData || !this.chartData.series) return
			// #ifdef MP-WEIXIN
			this.createSelectorQuery()
				.select('#' + this.canvasId)
				.fields({ node: true, size: true })
				.exec((res) => {
					if (!res || !res[0] || !res[0].node) return
					const canvas = res[0].node
					const ctx = canvas.getContext('2d')
					const dpr = uni.getSystemInfoSync().pixelRatio || 1
					canvas.width = res[0].width * dpr
					canvas.height = this.cHeight * dpr
					ctx.scale(dpr, dpr)
					this.chart = new UCharts({
						type: this.type,
						context: ctx,
						canvas,
						...this.chartData,
						opts: this.opts,
						width: res[0].width,
						height: this.cHeight,
						pixelRatio: dpr
					})
				})
			// #endif
			// #ifndef MP-WEIXIN
			this.chart = new UCharts({
				type: this.type,
				context: null,
				$this: this,
				canvasId: this.canvasId,
				...this.chartData,
				opts: this.opts,
				width: this.cWidth,
				height: this.cHeight,
				pixelRatio: 1
			})
			// #endif
		}
	}
}
</script>

<style scoped>
	.pp-chart {
		width: 100%;
	}

	.pp-canvas {
		width: 100%;
	}
</style>
