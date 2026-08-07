/**
 * 醫境醫療 MediRealm Medical Group — 入口網站
 * 零依賴靜態伺服器 + /api/clinics
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3308;
// 不指定 host：Node 預設以雙堆疊監聽（IPv4 0.0.0.0 + IPv6 ::1），
// 避免瀏覽器把 localhost 解析成 ::1 時連不上。
const HOST = process.env.HOST || undefined;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'clinics.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-cache', ...headers });
  res.end(body);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, buf) => {
    if (err) return send(res, 404, '404 Not Found', { 'Content-Type': 'text/plain; charset=utf-8' });
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    send(res, 200, buf, { 'Content-Type': type });
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // 品牌資料 API：每次讀檔，改完 data/clinics.json 重新整理即可生效
  if (url.pathname === '/api/clinics') {
    return fs.readFile(DATA_FILE, 'utf8', (err, txt) => {
      if (err) return send(res, 500, JSON.stringify({ error: 'clinics.json 讀取失敗' }), { 'Content-Type': MIME['.json'] });
      send(res, 200, txt, { 'Content-Type': MIME['.json'] });
    });
  }

  if (url.pathname === '/healthz') {
    return send(res, 200, 'ok', { 'Content-Type': 'text/plain' });
  }

  // 靜態檔案（阻擋路徑穿越）
  let rel;
  try {
    rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  } catch {
    return send(res, 400, '400 Bad Request', { 'Content-Type': 'text/plain' });
  }
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  const contained = path.relative(PUBLIC_DIR, filePath);
  if (contained.startsWith('..') || path.isAbsolute(contained)) {
    return send(res, 403, '403 Forbidden', { 'Content-Type': 'text/plain' });
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return serveFile(res, path.join(PUBLIC_DIR, 'index.html')); // SPA fallback
    }
    serveFile(res, filePath);
  });
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  醫境醫療 MediRealm Medical Group');
  console.log(`  ▸ http://localhost:${PORT}`);
  console.log(`  ▸ 品牌資料：data/clinics.json（新增一筆即自動變成五角形、六角形…）`);
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  [錯誤] 連接埠 ${PORT} 已被占用（請確認沒有其他服務在跑）。`);
    console.error(`  可改用：PORT=4000 npm start\n`);
    process.exit(1);
  }
  throw err;
});
