/* 醫境醫療集團 入口網站 — 多邊形星圖（品牌數改變即自動 四角 → 五角 → 六角…） */
(function () {
  'use strict';

  /** 醫境 LOGO：圓形三等分（乳白 / 木質 / 草綠） */
  function logoSVG(opts) {
    var o = opts || {};
    var ring = o.ring === false ? '' :
      '<circle cx="0" cy="0" r="104" fill="none" stroke="' + (o.ringColor || '#C09A6B') + '" stroke-width="3" opacity=".55"/>';
    return '' +
      '<svg viewBox="-108 -108 216 216" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        ring +
        '<path d="M0,0 A50,50 0 0,1 0,-100 A100,100 0 0,1 86.603,50 A50,50 0 0,0 0,0 Z" fill="#C09A6B"/>' +
        '<path d="M0,0 A50,50 0 0,1 86.603,50 A100,100 0 0,1 -86.603,50 A50,50 0 0,0 0,0 Z" fill="#4B6B3A"/>' +
        '<path d="M0,0 A50,50 0 0,1 -86.603,50 A100,100 0 0,1 0,-100 A50,50 0 0,0 0,0 Z" fill="#F7F2E7"/>' +
      '</svg>';
  }

  var CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  function cn(n) {
    if (n <= 10) return CN_NUM[n];
    if (n < 20) return '十' + CN_NUM[n - 10];
    return String(n);
  }
  function shapeName(n) {
    if (n <= 1) return '單點';
    if (n === 2) return '雙星';
    return cn(n) + '角形';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** 多邊形座標：第一個節點永遠在正上方，其餘等分排列
   *  只有兩個品牌時從正左方起算，改成左右並排（桌機寬度夠，上下排會太空） */
  function polygonPoints(n, radius) {
    var pts = [];
    var start = n === 2 ? 180 : -90;
    for (var i = 0; i < n; i++) {
      var a = (start + (360 / n) * i) * Math.PI / 180;
      pts.push({ x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a) });
    }
    return pts;
  }

  function radiusFor(n) {
    if (n <= 3) return 32;
    if (n === 4) return 35;
    if (n <= 6) return 37;
    return 39;
  }

  function nodeCard(c, index) {
    var live = !!c.url;
    var tag = live ? 'a' : 'div';
    var attrs = live
      ? 'href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer"'
      : 'aria-disabled="true"';
    var services = (c.services || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    var meta = [];
    if (c.location) meta.push('◈ ' + esc(c.location));
    if (c.line) meta.push('LINE ' + esc(c.line));

    return '' +
      '<' + tag + ' class="node theme-' + esc(c.theme || 'cream') + (live ? '' : ' is-soon') + '" ' + attrs +
        ' style="animation-delay:' + (0.12 * index + 0.1).toFixed(2) + 's">' +
        '<div class="node-top">' +
          '<div class="node-mark">' + logoSVG({ ring: false }) +
            '<span class="node-initials">' + esc(c.initials || '') + '</span>' +
          '</div>' +
          '<span class="node-emoji">' + esc(c.emoji || '') + '</span>' +
        '</div>' +
        '<h2 class="node-zh">' + esc(c.clinicZh) + '</h2>' +
        '<p class="node-en">' + esc(c.clinicEn) + '</p>' +
        '<span class="node-pill">' + esc(c.position) + '</span>' +
        '<p class="node-brand">' + esc(c.brandEn) + (c.brandSub ? ' ' + esc(c.brandSub) : '') +
          '｜' + esc(c.brandZh) + '</p>' +
        (services ? '<ul class="node-services">' + services + '</ul>' : '') +
        (meta.length ? '<p class="node-meta">' + meta.join('<br>') + '</p>' : '') +
        '<p class="node-cta"><span>' + (live ? '前往品牌官網' : '據點籌備中　敬請期待') + '</span>' +
          '<span class="arrow">' + (live ? '→' : '·') + '</span></p>' +
      '</' + tag + '>';
  }

  function drawWeb(svg, pts) {
    var parts = [];
    // 外圈：多邊形邊
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i], b = pts[(i + 1) % pts.length];
      parts.push('<line class="edge" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>');
    }
    // 內圈：中心輻射
    pts.forEach(function (p) {
      parts.push('<line class="spoke" x1="50" y1="50" x2="' + p.x + '" y2="' + p.y + '"/>');
    });
    svg.innerHTML = parts.join('');
  }

  function layout(nodesEl, pts) {
    var cards = nodesEl.children;
    var stacked = window.matchMedia('(max-width: 880px)').matches;
    for (var i = 0; i < cards.length; i++) {
      if (stacked) {
        cards[i].style.left = '';
        cards[i].style.top = '';
      } else {
        cards[i].style.left = pts[i].x + '%';
        cards[i].style.top = pts[i].y + '%';
      }
    }
  }

  function render(data) {
    var clinics = data.clinics || [];
    var n = clinics.length;
    var pts = polygonPoints(n, radiusFor(n));

    // 標頭
    document.getElementById('heroMark').innerHTML = logoSVG({});
    document.getElementById('coreMark').innerHTML = logoSVG({ ring: false });
    if (data.group) {
      if (data.group.nameEn) document.getElementById('heroEn').textContent = data.group.nameEn;
      if (data.group.slogan) document.getElementById('heroSlogan').textContent = data.group.slogan;
      document.getElementById('heroTagline').textContent =
        cn(n) + '大品牌・' + (data.group.tagline || '專業團隊・用心服務每一位您');
    }

    // 節點
    var nodesEl = document.getElementById('nodes');
    nodesEl.innerHTML = clinics.map(nodeCard).join('');

    // 兩個品牌時容器改成扁的，否則正方形會留下大片空白
    document.getElementById('constellation').classList.toggle('is-pair', n === 2);

    // 連線 + 定位
    var svg = document.getElementById('web');
    drawWeb(svg, pts);
    layout(nodesEl, pts);
    window.addEventListener('resize', function () { layout(nodesEl, pts); });

    document.getElementById('shapeNote').textContent =
      shapeName(n) + '・醫境星圖　—　點選任一據點進入品牌官網';
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  fetch('/api/clinics')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(render)
    .catch(function (err) {
      console.error('[醫境] 品牌資料載入失敗：', err);
      document.getElementById('shapeNote').textContent = '品牌資料載入失敗，請確認伺服器與 data/clinics.json。';
    });
})();
