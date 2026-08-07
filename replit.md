# 醫境醫療集團 MediRealm Medical Group — 入口網站

## Overview
純 Node.js（無外部依賴）的靜態入口網站，展示集團旗下診所品牌（曜妍診所、雲纖醫境診所）。

## How to run
- Workflow「Start application」執行 `PORT=5000 npm start`（即 `node server.js`）。
- 伺服器讀取 `PORT` 環境變數，Replit 上固定使用 5000。

## Structure
- `server.js` — 簡易 HTTP 伺服器
- `public/` — 前端頁面（index.html / app.js / styles.css / logo.svg）
- `data/clinics.json` — 品牌資料，新增一筆會自動呈現於頁面

## User preferences
（尚無）
