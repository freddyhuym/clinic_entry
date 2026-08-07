# 醫境醫療 MediRealm Medical Group — 入口網站

零依賴 Node.js 靜態伺服器 + 原生前端（無需 build、無需 `npm install`）。

## 啟動

```powershell
cd C:\Users\User\Clinic\clinic_entry
npm start          # → http://localhost:3308
```

換連接埠（若 3308 已被其他服務占用）：

```powershell
$env:PORT=4000; npm start
```

## 新增品牌（四角形 → 五角形 → 六角形…）

只要編輯 **`data/clinics.json`**，在 `clinics` 陣列加一筆，重新整理頁面即可 —
星圖會自動重新等分排列，標題的「四大品牌」與底下的「四角形・醫境星圖」也會跟著變。
不需要改任何 CSS 或 JS。

```jsonc
{
  "id": "newbrand",
  "emoji": "🌼",
  "brandEn": "MediRealm XXX",   // 英文品牌線
  "brandSub": "",               // 副標（選填）
  "brandZh": "中文品牌線",
  "clinicZh": "○○診所",
  "clinicEn": "XXX CLINIC",
  "initials": "XX",             // LOGO 中央字母
  "position": "定位標籤",
  "services": ["項目一", "項目二", "項目三", "項目四"],
  "location": "地址",
  "line": "@line_id",
  "url": null,                  // 有官網就填網址；null = 顯示「敬請期待」且不可點擊
  "theme": "green"              // green | cream | woodgreen | wood
}
```

## 配色系統（三原色）

| Token | 色值 | 說明 |
|---|---|---|
| 乳白 | `#F7F2E7` | `--cream` |
| 木質 | `#C09A6B` | `--wood` |
| 草綠 | `#4B6B3A` | `--green` |

卡片主題：

- `green` — 草綠底 + 乳白字（曜妍．頂級醫美）
- `cream` — 乳白底 + 木質字（初顏．國際／小資）
- `woodgreen` — 木質→草綠漸層底 + 乳白字（纖顏醫境．代謝減重）
- `wood` — 木質底 + 乳白字（沐生美．再生醫學）

## 檔案結構

```
clinic_entry/
├── server.js            # 靜態伺服器 + /api/clinics
├── data/clinics.json    # ← 唯一需要維護的檔案
└── public/
    ├── index.html
    ├── styles.css       # 三原色 token 都在 :root
    ├── app.js           # 多邊形座標計算 + 卡片渲染
    └── logo.svg         # 醫境 LOGO（圓形三等分）
```

## 端點

- `/` — 入口頁
- `/api/clinics` — 品牌資料 JSON（每次請求即時讀檔）
- `/healthz` — 健康檢查
