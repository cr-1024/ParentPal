# ParentPal · 家长伙伴

新手父母的科学养娃助手：**一套代码**产出 App（iOS/Android）、微信小程序、桌面端。

## 功能模块

1. **发育体检**：0-3 岁全周期体检计划，提前 7 天/1 天提醒，每次检查范围与考察项目，成长曲线
2. **哄睡提醒与睡眠记录**：按清醒间隔智能提醒，睡眠统计与按月龄建议
3. **喂奶提醒与记录**：母乳计时/奶粉奶量，间隔提醒，日汇总
4. **排便记录**：9 种性状选择，异常情况就医提示
5. **育儿指导推送**：按月龄推送发育里程碑、亲子游戏、音乐启蒙曲目建议

## 技术栈

- **uni-app（Vue 3）+ Vite** —— 一套代码多端编译
- Pinia 2.1.7（状态管理，`--legacy-peer-deps` 安装：npm 对 peerOptional 的误伤）
- 图表：ucharts（待接入）
- 桌面端：H5 产物 + Electron（M3）

## 快速开始

```bash
npm install

# 微信小程序
npm run dev:mp-weixin      # 开发；构建 npm run build:mp-weixin

# H5（桌面端基础）
npm run dev:h5             # 开发；构建 npm run build:h5

# App
npm run dev:app-plus       # 需 HBuilderX 或自定义基座
```

## 目录结构

```
src/
├── pages/
│   ├── index/index.vue      # 首页：今日总览 + 到期提醒
│   ├── checkup/index.vue    # 发育体检：计划 + 检查项目 + 时间轴
│   ├── records/index.vue    # 记录：睡眠 / 喂奶 / 便便（分段）
│   └── growth/index.vue     # 成长指导：里程碑 + 音乐启蒙
├── store/index.js           # 全局状态（Pinia 2.1.7）
├── static/                  # 静态资源
├── pages.json               # 页面与 tabBar 配置
├── manifest.json            # 应用配置
└── uni.scss                 # 全局样式变量

docs/
├── requirements.md          # 需求文档
├── tech-stack.md            # 技术选型对比
└── design/mockups.html      # 设计稿（低保真原型，浏览器打开）
```

## 当前状态（2026-10-13）

- [x] 项目骨架：uni-app Vue3 + 4 个主页面 + tabBar
- [x] 双端构建验证通过（mp-weixin / h5）
- [x] 需求文档 + 技术选型 + 设计稿
- [ ] 数据层：本地存储 + 记录读写（M1）
- [ ] 提醒引擎：App 本地通知（M1）
- [ ] ucharts 统计图表（M1）
- [ ] 云同步 / 家庭共享 / Electron 桌面端（M3）

> 页面当前为演示数据，数据层接入后替换为真实记录。
