<div align="center">
  <h1>🎄 Gesture-Controlled Christmas Tree Magic Particles / 手势魔法粒子圣诞树</h1>
  <p>Interactive WebGL particle experience controlled by hand gestures / 用手势把粒子从「星云爆炸」切换成「圣诞树」的 WebGL 互动小作品</p>
</div>

**Language**: [中文](#中文) | [English](#english)

<!--
  ✅ GIF 演示位（你上传后把路径替换掉即可）
  方案 A（推荐）：把 GIF 放到仓库里，例如：/docs/demo.gif
  然后改成：![Demo](docs/demo.gif)

  方案 B：上传到 GitHub Issue / Release / user-attachments 后，用外链替换：
  ![Demo](https://...)
-->

![Demo GIF ](docs/demo.gif)

## English

### Overview

An interactive **WebGL particle** experience built with **React + React Three Fiber (Three.js)**:

- **Open Hand**: particles expand into a “nebula / explosion” state (auto-rotating)
- **Fist**: particles converge into a “Christmas tree” shape and light up the top star
- The **SENSOR VIEW** in the bottom-right shows a semi-transparent camera feed + hand skeleton for debugging

Hand tracking is powered by **MediaPipe Hands** and is throttled (~10 FPS) to keep the 3D animation smooth.

### Tech Stack

- **Vite + React + TypeScript**
- **Three.js / @react-three/fiber / @react-three/drei**
- **@react-three/postprocessing** (Bloom, Vignette)
- **MediaPipe Hands**

### Run Locally

#### Prerequisites

- Node.js (recommended **18+**)
- **pnpm** recommended (this repo includes `pnpm-lock.yaml`)

#### Install dependencies

```bash
pnpm install
```

If you don’t have pnpm, you can use npm (keeping lockfiles consistent is recommended):

```bash
npm install
```

#### Start dev server

```bash
pnpm dev
```

Then open the local URL shown in your terminal (usually `http://localhost:5173`).

#### Build & preview

```bash
pnpm build
pnpm preview
```

### How to Play

1. Open the page and click **Start Magic**
2. Allow camera permission when prompted
3. In front of the camera:
   - **Open Hand** → “EXPLODE / Nebula”
   - **Fist** → “TREE / Christmas Tree”

Tip: keep your hand fully in frame and use good lighting for more stable tracking.

### Troubleshooting

- **No effects / hand not detected**
  - Check browser camera permissions
  - Try Chrome (often best compatibility for MediaPipe)
  - Use brighter lighting and keep your hand fully in frame

- **Camera won’t start**
  - `localhost` usually allows camera access; for LAN IP access you may need HTTPS
  - Some org/device policies can block camera access


## 中文

### 项目简介

这是一个基于 **React + React Three Fiber(Three.js)** 的粒子场景：

- **张开手掌（Open Hand）**：粒子进入「星云 / 爆炸」形态（自动旋转）
- **握拳（Fist）**：粒子收拢为「圣诞树」形态，并点亮顶部星星
- 右下角的 **SENSOR VIEW** 会显示摄像头画面（半透明）与手部骨架，方便调试手势识别

手势识别使用 **MediaPipe Hands**，为了保证 3D 动画流畅，检测频率做了节流（约 10 FPS）。

### 技术栈

- **Vite + React + TypeScript**
- **Three.js / @react-three/fiber / @react-three/drei**
- **@react-three/postprocessing**（Bloom、Vignette）
- **MediaPipe Hands**（手势识别）

### 本地运行

#### 前置要求

- Node.js（建议 **18+** 或更新）
- 推荐使用 **pnpm**（仓库里包含 `pnpm-lock.yaml`）

#### 安装依赖

```bash
pnpm install
```

如果你没有 pnpm，也可以用 npm（但推荐保持 lockfile 一致）：

```bash
npm install
```

#### 启动开发环境

```bash
pnpm dev
```

然后在浏览器打开终端输出的本地地址（通常是 `http://localhost:5173`）。

#### 构建与预览

```bash
pnpm build
pnpm preview
```

### 如何玩

1. 打开页面后点击 **Start Magic**
2. 浏览器会请求摄像头权限，请选择 **允许**
3. 对着摄像头：
   - **张开手掌**：触发「EXPLODE / Nebula」
   - **握拳**：触发「TREE / Christmas Tree」

提示：保持手掌在画面中、光线充足，会更稳定。

### 常见问题（Troubleshooting）

- **看不到效果 / 一直识别不到手**
  - 确认浏览器已允许摄像头权限
  - 尝试换到 Chrome（对 MediaPipe 兼容性通常最好）
  - 保证环境光充足，手掌完整出现在画面里

- **摄像头打不开**
  - `localhost` 通常允许摄像头；如果你是通过局域网 IP 访问，可能需要 HTTPS
  - 公司/系统策略可能会禁用摄像头访问

