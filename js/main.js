/**
 * main.js — 全站公共逻辑
 * 命理学数字实验室
 */

// ── 导航高亮 ──────────────────────────────────────────────────
(function initNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // 移动端菜单
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? '' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(8,8,8,0.97)';
      links.style.padding = '16px 24px 24px';
      links.style.borderBottom = '1px solid rgba(255,255,255,0.07)';
      links.style.backdropFilter = 'blur(20px)';
    });
  }
})();

// ── 滚动视差 + 导航阴影 ────────────────────────────────────────
(function initScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 10
      ? 'rgba(201,168,76,0.15)'
      : 'rgba(255,255,255,0.07)';
  }, { passive: true });
})();

// ── Intersection Observer 入场动画 ────────────────────────────
(function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .feature-card, .stat, .pillar').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();

// ── 工具函数 ──────────────────────────────────────────────────

/** 今日日期填入表单 */
function fillToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  const h = now.getHours();
  const inputs = document.querySelectorAll('[data-today]');
  inputs.forEach(el => {
    if (el.dataset.today === 'year')  el.value = y;
    if (el.dataset.today === 'month') el.value = m;
    if (el.dataset.today === 'day')   el.value = d;
    if (el.dataset.today === 'hour')  el.value = h;
  });
}

/** 五行颜色 */
const WX_COLOR = { 木:'#4ade80', 火:'#f87171', 土:'#fbbf24', 金:'#e2e8f0', 水:'#60a5fa' };

function wxSpan(wx) {
  const color = WX_COLOR[wx] || '#a1a1a6';
  return `<span style="color:${color}">${wx}</span>`;
}

/** 格式化日期 */
function formatDate(y, m, d) {
  return `${y}年${m}月${d}日`;
}

/** 数字转汉字序数（简化） */
function numToChinese(n) {
  const map = ['零','一','二','三','四','五','六','七','八','九','十',
               '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'];
  return map[n] || n;
}

/** 显示加载态 */
function showLoading(container) {
  container.innerHTML = '<div class="spinner"></div>';
}

/** 数字动画 */
function animateNumber(el, target, duration = 1000) {
  const start = performance.now();
  const from = parseFloat(el.textContent) || 0;
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    el.textContent = Math.round(from + (target - from) * ease);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/** Toast 通知 */
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:${type === 'error' ? '#f87171' : 'var(--bg-card)'};
    color:${type === 'error' ? '#000' : 'var(--text-primary)'};
    border:1px solid var(--border-gold);
    padding:12px 24px; border-radius:999px;
    font-size:0.9rem; z-index:9999;
    animation:fadeUp 0.3s ease both;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/** 复制到剪贴板 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('已复制到剪贴板');
  } catch {
    toast('复制失败，请手动选择文本', 'error');
  }
}

/** URL 参数读取 */
function getQueryParam(key) {
  return new URLSearchParams(location.search).get(key);
}

// 全局暴露
window.ML = { fillToday, wxSpan, formatDate, numToChinese, showLoading, animateNumber, toast, copyToClipboard, getQueryParam, WX_COLOR };
