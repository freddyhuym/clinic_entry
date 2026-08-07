# 醫境醫療 YIJING MEDICAL GROUP — 品牌入口網站 (Brand Gateway)

## Overview
純 Node.js（無外部依賴）的品牌入口網站。目的單一：讓使用者選擇進入「曜妍醫療體系」或「纖顏醫境體系」。不是完整企業官網，不放療程、醫師、衛教等內容。

## How to run
- Workflow「Start application」執行 `PORT=5000 npm start`（即 `node server.js`）。
- 伺服器讀取 `PORT` 環境變數，Replit 上固定使用 5000。

## Structure
- `server.js` — 簡易 HTTP 伺服器（含 `/api/clinics`）
- `public/` — 前端頁面（index.html / app.js / styles.css / logo.svg）
- `data/clinics.json` — 集團與品牌設定；`brandLinks` 集中管理兩體系外部網址
  - 曜妍：https://carebeautyclinic.com.tw/
  - 纖顏：https://medirealm-metabolic.com/

## Design
- Quiet Luxury / Minimal / Premium Medical
- 桌機左右 Split（左曜妍深綠×香檳金、右纖顏奶油白×霧青綠 #72BAB4×金 #CE9A4B），手機上下堆疊
- 品牌名稱一律用「纖顏醫境」（舊名「雲纖醫境」勿再使用；各館名初纖顏/沐纖顏/森纖顏不變）

## User preferences
（尚無）
