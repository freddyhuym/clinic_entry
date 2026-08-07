/**
 * 醫境醫療 · Brand Gateway
 * 品牌連結集中於 data/clinics.json 的 brandLinks，
 * 頁面載入後同步至兩個 Panel（HTML 內已有相同預設值作為後備）。
 */
(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  fetch('/api/clinics')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !data.brandLinks) return;
      const map = { linkYaoyan: data.brandLinks.yaoyan, linkXianyan: data.brandLinks.xianyan };
      for (const [id, url] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el && url) el.href = url;
      }
    })
    .catch(() => { /* 保留 HTML 預設連結 */ });
})();
