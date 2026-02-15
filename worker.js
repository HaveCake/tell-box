// TELL-BOX V5.1 - 完整版 (含二维码海报 + 零密钥感知)
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Tell - 写一封匿名信给我</title>
<meta name="description" content="匿名悄悄话，端到端加密，只有收信人能看到">
<meta property="og:title" content="有人邀请你写一封匿名悄悄话 💌">
<meta property="og:description" content="你的秘密，只有TA能看到。端到端加密，完全匿名。">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: { extend: {
      colors: { wx: '#07c160', qq: '#12b7f5', xhs: '#ff2442', dy: '#010101', wb: '#ff8200', darkbg: '#0f172a' },
    }}
  }
</script>
<style>
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif; }

  .page { display: none; padding-bottom: 100px; }
  .page.active { display: block; animation: slideUp 0.25s ease-out; }
  @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes toastIn { from { opacity:0; transform:translate(-50%,-16px); } to { opacity:1; transform:translate(-50%,0); } }
  @keyframes toastOut { from { opacity:1; transform:translate(-50%,0); } to { opacity:0; transform:translate(-50%,-16px); } }
  @keyframes modalUp { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
  @keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-4px); } 75% { transform:translateX(4px); } }
  @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

  .skeleton { background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:12px; }
  .dark .skeleton { background:linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%); background-size:200% 100%; }

  .toast { position:fixed; top:72px; left:50%; transform:translateX(-50%); z-index:999; min-width:240px; max-width:88vw; padding:12px 20px; border-radius:14px; font-size:14px; font-weight:500; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.12); animation:toastIn 0.3s ease-out; pointer-events:none; }
  .toast.success { background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
  .toast.error { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
  .toast.info { background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; }
  .toast.hiding { animation:toastOut 0.3s ease-in forwards; }

  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:flex-end; justify-content:center; animation:fadeIn 0.2s; }
  .modal-content { background:white; width:100%; max-width:480px; border-radius:20px 20px 0 0; padding:24px 20px; max-height:90vh; overflow-y:auto; animation:modalUp 0.3s ease-out; }
  .dark .modal-content { background:#1e293b; }
  @media(min-width:640px) { .modal-content { border-radius:20px; margin-bottom:20px; } }

  .btn-press:active { transform:scale(0.97); }
  .nav-item.active { color:#07c160; }
  @supports(padding-bottom:env(safe-area-inset-bottom)) { .bottom-nav { padding-bottom:calc(8px + env(safe-area-inset-bottom)); } }

  .char-warn { color:#f59e0b; }
  .char-danger { color:#ef4444; font-weight:600; }

  .emoji-btn { width:44px; height:44px; font-size:24px; border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.15s; border:2px solid transparent; }
  .emoji-btn:hover { background:rgba(0,0,0,0.05); }
  .emoji-btn.selected { border-color:#07c160; background:#ecfdf5; transform:scale(1.1); }
  .dark .emoji-btn:hover { background:rgba(255,255,255,0.05); }
  .dark .emoji-btn.selected { background:rgba(7,193,96,0.15); }

  .platform-btn { display:flex; flex-direction:column; align-items:center; gap:6px; padding:12px 8px; border-radius:14px; cursor:pointer; transition:all 0.15s; min-width:64px; }
  .platform-btn:active { transform:scale(0.93); }
  .platform-btn .icon { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; }
  .platform-btn .label { font-size:11px; font-weight:500; color:#666; }
  .dark .platform-btn .label { color:#aaa; }

  #poster-canvas { max-width:100%; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,0.15); }
</style>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-darkbg dark:text-gray-100 min-h-screen flex flex-col transition-colors">

  <header class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-50 h-14 flex items-center justify-between px-4">
    <div class="font-bold text-lg flex items-center gap-2">
      <span class="bg-wx text-white px-2.5 py-0.5 rounded-lg text-sm font-black">TELL</span>
    </div>
    <button onclick="toggleTheme()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition btn-press" aria-label="主题">
      <svg id="icon-sun" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      <svg id="icon-moon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
    </button>
  </header>

  <main class="flex-1 mt-16 px-4 max-w-lg mx-auto w-full">
    <div id="page-me" class="page active">
      <div id="setup-view" class="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 text-center">
        <div class="text-5xl mb-4">💌</div>
        <h2 class="text-xl font-bold mb-2">开始收匿名信</h2>
        <p class="text-sm text-gray-400 mb-6">给自己取个名字，生成专属链接</p>
        <div class="space-y-4 text-left">
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">选一个头像</label>
            <div id="avatar-picker" class="flex flex-wrap gap-2"></div>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">你的昵称</label>
            <input id="setup-name" maxlength="12" placeholder="例如：小明、匿名树洞…" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition">
          </div>
          <button onclick="createIdentity()" class="w-full bg-wx hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/25 btn-press mt-2">✨ 生成我的信箱</button>
        </div>
      </div>
      <div id="profile-view" class="hidden space-y-4">
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 text-center">
          <div id="profile-avatar" class="text-5xl mb-2"></div>
          <h2 id="profile-name" class="text-xl font-bold mb-1"></h2>
          <p class="text-xs text-gray-400">你的匿名信箱已开通</p>
          <div class="flex items-center justify-center gap-1.5 mt-2">
            <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-[11px] text-green-600 dark:text-green-400 font-medium">加密通道就绪</span>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <h3 class="font-bold text-base mb-4 flex items-center gap-2">📣 邀请朋友写信</h3>
          <button onclick="openShareModal()" class="w-full bg-wx hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/25 btn-press flex items-center justify-center gap-2 mb-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            分享我的信箱
          </button>
          <button onclick="copyLink()" class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl btn-press flex items-center justify-center gap-2">📋 复制链接</button>
        </div>
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <button onclick="editProfile()" class="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
            <span class="text-sm font-medium">修改昵称和头像</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <div class="h-px bg-gray-100 dark:bg-gray-700/50"></div>
          <button onclick="exportBackup()" class="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
            <span class="text-sm font-medium">备份信箱数据</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <div class="h-px bg-gray-100 dark:bg-gray-700/50"></div>
          <button onclick="importBackup()" class="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
            <span class="text-sm font-medium">恢复信箱数据</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div id="page-send" class="page">
      <div id="send-to-view" class="hidden">
        <div class="text-center mb-5">
          <div id="recipient-avatar" class="text-5xl mb-2">💌</div>
          <h2 class="text-lg font-bold">写给 <span id="recipient-name" class="text-wx">TA</span></h2>
          <p class="text-xs text-gray-400 mt-1">消息端到端加密，完全匿名</p>
        </div>
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">想说的话</label>
              <span id="charCounter" class="text-[11px] text-gray-400">0 / 5000</span>
            </div>
            <textarea id="msg" oninput="updateCharCount()" placeholder="匿名的，放心说..." class="w-full h-48 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-base focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition resize-none leading-relaxed"></textarea>
          </div>
          <button onclick="send()" id="sendBtn" class="w-full bg-wx hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/25 transition btn-press flex items-center justify-center gap-2 disabled:opacity-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            匿名发送
          </button>
        </div>
      </div>
      <div id="send-empty-view" class="text-center py-20">
        <div class="text-5xl mb-4">✉️</div>
        <h2 class="text-lg font-bold mb-2">还没有收件人</h2>
        <p class="text-sm text-gray-400 mb-6">需要通过朋友分享的链接<br>才能给TA写匿名信哦</p>
      </div>
      <div id="send-success-view" class="hidden text-center py-16">
        <div class="text-6xl mb-4" id="success-confetti">🎉</div>
        <h2 class="text-xl font-bold mb-2 text-green-600">发送成功！</h2>
        <p class="text-sm text-gray-400 mb-8">你的匿名信已安全送达<br>只有收信人能解密查看</p>
        <button onclick="resetSend()" class="px-8 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-sm btn-press">再写一封</button>
      </div>
    </div>

    <div id="page-inbox" class="page">
      <div class="flex justify-between items-center mb-4 px-1">
        <h2 class="text-2xl font-bold flex items-center gap-2">收信箱 <span class="text-2xl">📬</span></h2>
        <button onclick="loadInbox()" id="refreshBtn" class="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium btn-press flex items-center gap-1.5">
          <svg id="refreshIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          刷新
        </button>
      </div>
      <div id="inbox" class="space-y-3">
        <div id="inbox-empty" class="text-center py-16 text-gray-400 text-sm bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50">
          <div class="text-4xl mb-3">📭</div>
          <p>分享链接给朋友<br>就能收到匿名信了</p>
        </div>
      </div>
      <div id="pagination" class="hidden flex justify-center mt-4">
        <button onclick="loadInbox(currentCursor)" class="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition btn-press">加载更多</button>
      </div>
    </div>
  </main>

  <nav class="bottom-nav fixed bottom-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 pt-2 pb-2 px-6 flex justify-around items-center z-50 h-16">
    <button onclick="nav('me')" id="nav-me" class="nav-item active flex flex-col items-center gap-0.5 text-gray-400 w-16 transition btn-press">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      <span class="text-[10px] font-medium">我的</span>
    </button>
    <button onclick="nav('send')" id="nav-send" class="nav-item flex flex-col items-center gap-0.5 text-gray-400 w-16 transition btn-press">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
      <span class="text-[10px] font-medium">写信</span>
    </button>
    <button onclick="nav('inbox')" id="nav-inbox" class="nav-item flex flex-col items-center gap-0.5 text-gray-400 w-16 transition btn-press">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
      <span class="text-[10px] font-medium">收信</span>
    </button>
  </nav>

  <div id="share-modal" class="hidden"></div>
  
  <canvas id="poster-canvas" style="display:none;"></canvas>
  <div id="qr-code-hidden" style="position:fixed;left:-9999px;top:-9999px;"></div>
  <input type="file" id="file-import" accept=".json" style="display:none" onchange="handleImportFile(event)">

<script>
// ==================== 基础工具 ====================
const B = b => window.btoa(String.fromCharCode(...new Uint8Array(b)));
const A = a => Uint8Array.from(atob(a), c => c.charCodeAt(0));
const $ = id => document.getElementById(id);
const AVATARS = ['😊','😎','🥰','🤗','😈','👻','🐱','🐶','🦊','🐰','🐼','🦋','🌸','🌈','⭐','🔥','💎','🎭','🎪','🎠'];
const MAX_CHARS = 5000;
let currentCursor = null;
let recipientPubKey = null;
let recipientInfo = null;
let recipientAddr = null;
let selectedAvatar = null;

// ==================== Toast & Utils ====================
let toastTimer = null;
function toast(msg, type='info', duration=2500) {
  const old = document.querySelector('.toast');
  if(old) old.remove();
  clearTimeout(toastTimer);
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  toastTimer = setTimeout(() => {
    el.classList.add('hiding');
    setTimeout(() => el.remove(), 300);
  }, duration);
}

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// ==================== 初始化 ====================
window.onload = function() {
  initTheme();
  initAvatarPicker();
  loadProfile();
  handleUrlParams();
}

function initTheme() {
  const dark = localStorage.theme==='dark' || (!('theme' in localStorage) && matchMedia('(prefers-color-scheme:dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  $('icon-sun').classList.toggle('hidden', !dark);
  $('icon-moon').classList.toggle('hidden', dark);
}
function toggleTheme() {
  const d = document.documentElement.classList.toggle('dark');
  localStorage.theme = d ? 'dark' : 'light';
  $('icon-sun').classList.toggle('hidden', !d);
  $('icon-moon').classList.toggle('hidden', d);
}
function nav(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  $('page-'+page).classList.add('active');
  $('nav-'+page).classList.add('active');
}

// ==================== 核心逻辑 ====================
function initAvatarPicker() {
  const container = $('avatar-picker');
  container.innerHTML = '';
  AVATARS.forEach((emoji) => {
    const btn = document.createElement('div');
    btn.className = 'emoji-btn';
    btn.textContent = emoji;
    btn.onclick = () => selectAvatar(emoji);
    container.appendChild(btn);
  });
  selectAvatar(AVATARS[0]);
}

function selectAvatar(emoji) {
  selectedAvatar = emoji;
  document.querySelectorAll('.emoji-btn').forEach(el => el.classList.toggle('selected', el.textContent === emoji));
}

async function createIdentity() {
  const name = $('setup-name').value.trim();
  if(!name) { $('setup-name').style.animation='shake 0.3s'; setTimeout(()=>$('setup-name').style.animation='',300); return toast('请输入昵称','error'); }
  if(!selectedAvatar) return toast('请选择头像','error');
  try {
    const k = await crypto.subtle.generateKey({ name:"RSA-OAEP", modulusLength:2048, publicExponent:new Uint8Array([1,0,1]), hash:"SHA-256" }, true, ["encrypt","decrypt"]);
    const pub = B(await crypto.subtle.exportKey("spki", k.publicKey));
    const pri = B(await crypto.subtle.exportKey("pkcs8", k.privateKey));
    const addr = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16).padStart(2,'0')).join('');
    const profile = { name, avatar: selectedAvatar };
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ id: addr, pub, profile }) });
    if(!res.ok) throw new Error('注册失败');
    localStorage.setItem('tell_pub', pub);
    localStorage.setItem('tell_pri', pri);
    localStorage.setItem('tell_addr', addr);
    localStorage.setItem('tell_profile', JSON.stringify(profile));
    loadProfile();
    toast('🎉 信箱创建成功！', 'success');
  } catch(e) { toast('创建失败: ' + e.message, 'error'); }
}

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('tell_profile') || 'null');
  if(profile) {
    $('setup-view').classList.add('hidden');
    $('profile-view').classList.remove('hidden');
    $('profile-avatar').textContent = profile.avatar;
    $('profile-name').textContent = profile.name;
  } else {
    $('setup-view').classList.remove('hidden');
    $('profile-view').classList.add('hidden');
  }
  updateSendPage();
}

function editProfile() {
  const profile = JSON.parse(localStorage.getItem('tell_profile') || '{}');
  $('setup-name').value = profile.name || '';
  selectAvatar(profile.avatar || AVATARS[0]);
  $('setup-view').classList.remove('hidden');
  $('profile-view').classList.add('hidden');
  const btn = $('setup-view').querySelector('button');
  btn.textContent = '✅ 保存修改';
  btn.onclick = async () => {
    const name = $('setup-name').value.trim();
    if(!name) return toast('请输入昵称', 'error');
    const newProfile = { name, avatar: selectedAvatar };
    const addr = localStorage.getItem('tell_addr');
    const pub = localStorage.getItem('tell_pub');
    try {
      await fetch('/api/register', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ id: addr, pub, profile: newProfile }) });
      localStorage.setItem('tell_profile', JSON.stringify(newProfile));
      btn.textContent = '✨ 生成我的信箱';
      btn.onclick = () => createIdentity();
      loadProfile();
      toast('✅ 已更新', 'success');
    } catch(e) { toast('保存失败', 'error'); }
  };
}

async function handleUrlParams() {
  const params = new URLSearchParams(location.search);
  const toAddr = params.get('to');
  if(!toAddr) return;
  try {
    const res = await fetch('/api/resolve?id=' + encodeURIComponent(toAddr));
    if(res.ok) {
      const data = await res.json();
      recipientPubKey = data.pub;
      recipientInfo = data.profile || { name: '匿名用户', avatar: '💌' };
      recipientAddr = toAddr;
      nav('send');
      updateSendPage();
    } else { toast('链接无效或已过期', 'error'); }
  } catch(e) { toast('链接解析失败', 'error'); }
  history.replaceState({}, '', location.pathname);
}

function updateSendPage() {
  if(recipientPubKey && recipientInfo) {
    $('send-to-view').classList.remove('hidden');
    $('send-empty-view').classList.add('hidden');
    $('send-success-view').classList.add('hidden');
    $('recipient-avatar').textContent = recipientInfo.avatar || '💌';
    $('recipient-name').textContent = recipientInfo.name || 'TA';
  } else {
    $('send-to-view').classList.add('hidden');
    $('send-empty-view').classList.remove('hidden');
    $('send-success-view').classList.add('hidden');
  }
}

// ==================== 加密发送 ====================
async function hybridEncrypt(pubKeyB64, plaintext) {
  const aesKey = await crypto.subtle.generateKey({ name:"AES-GCM", length:256 }, true, ["encrypt"]);
  const aesRaw = await crypto.subtle.exportKey("raw", aesKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = await crypto.subtle.encrypt({ name:"AES-GCM", iv }, aesKey, new TextEncoder().encode(plaintext));
  const rsaPub = await crypto.subtle.importKey("spki", A(pubKeyB64), { name:"RSA-OAEP", hash:"SHA-256" }, false, ["encrypt"]);
  const encAes = await crypto.subtle.encrypt({ name:"RSA-OAEP" }, rsaPub, aesRaw);
  const result = new Uint8Array(encAes.byteLength + 12 + enc.byteLength);
  result.set(new Uint8Array(encAes), 0);
  result.set(iv, encAes.byteLength);
  result.set(new Uint8Array(enc), encAes.byteLength + 12);
  return B(result.buffer);
}

async function hybridDecrypt(priKeyB64, cipherB64) {
  const buf = A(cipherB64);
  const encAes = buf.slice(0, 256);
  const iv = buf.slice(256, 268);
  const encData = buf.slice(268);
  const rsaPri = await crypto.subtle.importKey("pkcs8", A(priKeyB64), { name:"RSA-OAEP", hash:"SHA-256" }, false, ["decrypt"]);
  const aesRaw = await crypto.subtle.decrypt({ name:"RSA-OAEP" }, rsaPri, encAes);
  const aesKey = await crypto.subtle.importKey("raw", aesRaw, { name:"AES-GCM" }, false, ["decrypt"]);
  const dec = await crypto.subtle.decrypt({ name:"AES-GCM", iv }, aesKey, encData);
  return new TextDecoder().decode(dec);
}

function updateCharCount() {
  const len = $('msg').value.length;
  const el = $('charCounter');
  el.textContent = len + ' / ' + MAX_CHARS;
  el.className = 'text-[11px] ' + (len > MAX_CHARS ? 'char-danger' : len > MAX_CHARS*0.8 ? 'char-warn' : 'text-gray-400');
}

async function send() {
  const msg = $('msg').value.trim();
  if(!msg) return toast('请输入内容', 'error');
  if(msg.length > MAX_CHARS) return toast('内容超出字数限制', 'error');
  if(!recipientPubKey) return toast('没有收件人', 'error');
  const btn = $('sendBtn');
  btn.innerHTML = '<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> 加密中...';
  btn.disabled = true;
  try {
    const encrypted = await hybridEncrypt(recipientPubKey, msg);
    const res = await fetch('/api/send', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ to: recipientAddr, data: encrypted }) });
    if(res.ok) {
      $('msg').value = '';
      updateCharCount();
      $('send-to-view').classList.add('hidden');
      $('send-success-view').classList.remove('hidden');
    } else { toast('发送失败', 'error'); }
  } catch(e) { toast('加密或发送失败: ' + e.message, 'error'); }
  btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> 匿名发送';
  btn.disabled = false;
}
function resetSend() { $('send-success-view').classList.add('hidden'); $('send-to-view').classList.remove('hidden'); }

// ==================== 收信箱 ====================
async function loadInbox(cursor) {
  const pri = localStorage.getItem('tell_pri');
  const addr = localStorage.getItem('tell_addr');
  if(!pri || !addr) return toast('请先创建信箱', 'error');
  const inboxEl = $('inbox');
  if(!cursor) inboxEl.innerHTML = [0,1,2].map(() => '<div class="skeleton h-28 mb-3"></div>').join('');
  try {
    let apiUrl = '/api/inbox?addr=' + addr + '&limit=15';
    if(cursor) apiUrl += '&cursor=' + encodeURIComponent(cursor);
    const res = await fetch(apiUrl);
    const data = await res.json();
    if(!cursor) inboxEl.innerHTML = '';
    if(data.msgs.length === 0 && !cursor) {
      inboxEl.innerHTML = '<div class="text-center py-16 text-gray-400 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50"><div class="text-4xl mb-3">📭</div><p>还没有收到匿名信<br>快去分享链接吧</p></div>';
      $('pagination').classList.add('hidden');
      return;
    }
    for(const item of data.msgs) {
      try {
        const text = await hybridDecrypt(pri, item.data);
        const date = new Date(parseInt(item.ts)).toLocaleString('zh-CN');
        const div = document.createElement('div');
        div.className = 'msg-card bg-white dark:bg-gray-800/80 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50';
        div.innerHTML = \`<div class="flex justify-between items-center mb-3"><span class="text-[11px] bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full font-medium">🤫 匿名来信</span><span class="text-[11px] text-gray-400">\${date}</span></div><div class="text-gray-800 dark:text-gray-200 text-[15px] whitespace-pre-wrap leading-relaxed break-words">\${escapeHtml(text)}</div>\`;
        inboxEl.appendChild(div);
      } catch(e) { continue; }
    }
    if(data.cursor) { currentCursor = data.cursor; $('pagination').classList.remove('hidden'); } else { currentCursor = null; $('pagination').classList.add('hidden'); }
  } catch(e) { if(!cursor) inboxEl.innerHTML = ''; toast('拉取失败', 'error'); }
}

// ==================== 分享与海报 ====================
function getShareUrl() { return location.origin + '/?to=' + localStorage.getItem('tell_addr'); }
function copyLink() { navigator.clipboard.writeText(getShareUrl()).then(() => toast('✅ 链接已复制', 'success')); }

function openShareModal() {
  const modal = $('share-modal');
  modal.innerHTML = \`
    <div class="modal-overlay" onclick="if(event.target===this)closeShareModal()">
      <div class="modal-content">
        <div class="flex justify-between items-center mb-5"><h3 class="text-lg font-bold">分享给朋友</h3><button onclick="closeShareModal()" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
        <div id="poster-wrapper" class="mb-5 flex justify-center"><div class="text-center py-4 text-gray-400 text-sm">正在生成二维码海报...</div></div>
        <div class="mb-4"><p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">分享到</p><div class="flex justify-between"><div class="platform-btn" onclick="shareTo('wechat')"><div class="icon bg-[#07c160]/10"><span>💬</span></div><span class="label">微信</span></div><div class="platform-btn" onclick="shareTo('qq')"><div class="icon bg-[#12b7f5]/10"><span>🐧</span></div><span class="label">QQ</span></div><div class="platform-btn" onclick="shareTo('xhs')"><div class="icon bg-[#ff2442]/10"><span>📕</span></div><span class="label">小红书</span></div><div class="platform-btn" onclick="shareTo('douyin')"><div class="icon bg-gray-100 dark:bg-gray-700"><span>🎵</span></div><span class="label">抖音</span></div><div class="platform-btn" onclick="shareTo('weibo')"><div class="icon bg-[#ff8200]/10"><span>🔥</span></div><span class="label">微博</span></div></div></div><div class="h-px bg-gray-100 dark:bg-gray-700 my-4"></div><div class="flex gap-3"><button onclick="savePoster()" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-bold btn-press flex items-center justify-center gap-2">💾 保存海报</button><button onclick="copyShareText()" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-bold btn-press flex items-center justify-center gap-2">📋 复制文案</button></div>
      </div>
    </div>\`;
  modal.classList.remove('hidden');
  setTimeout(generatePoster, 100);
}
function closeShareModal() { $('share-modal').classList.add('hidden'); }

// 核心：生成带二维码的海报
async function generatePoster() {
  const profile = JSON.parse(localStorage.getItem('tell_profile') || '{}');
  const url = getShareUrl();
  const canvas = $('poster-canvas');
  const ctx = canvas.getContext('2d');
  const W = 750, H = 1050, dpr = 2;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);

  // 背景
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#e0f2fe'); grad.addColorStop(0.5, '#f0fdf4'); grad.addColorStop(1, '#fefce8');
  ctx.fillStyle = grad; roundRect(ctx, 0, 0, W, H, 0); ctx.fill();
  
  // 装饰
  ctx.globalAlpha = 0.08; ctx.fillStyle = '#07c160'; ctx.beginPath(); ctx.arc(620, 120, 200, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(100, 850, 150, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;

  // 卡片
  ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.06)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 8;
  roundRect(ctx, 50, 50, W-100, H-100, 32); ctx.fill(); ctx.shadowColor = 'transparent';

  // 信息
  ctx.font = '80px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; ctx.textAlign = 'center'; ctx.fillText(profile.avatar || '💌', W/2, 180);
  ctx.font = 'bold 42px sans-serif'; ctx.fillStyle = '#1e293b'; ctx.fillText(profile.name || '匿名用户', W/2, 260);
  ctx.font = '28px sans-serif'; ctx.fillStyle = '#64748b'; ctx.fillText('邀请你写一封匿名信给我', W/2, 320);

  // 分割
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(150, 360); ctx.lineTo(W-150, 360); ctx.stroke();

  // 特性
  const features = [['🔒','端到端加密'],['🤫','完全匿名'],['💌','真心话树洞']];
  ctx.textAlign = 'left';
  features.forEach((f, i) => {
  const y = 420 + i * 50;
  ctx.fillStyle = '#000000';
  ctx.font = '28px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(f[0], 150, y);
  ctx.fillStyle = '#475569';
  ctx.font = '24px sans-serif';
  ctx.fillText(f[1], 190, y);
});

  // 二维码区域
  const qrSize = 280;
  const qrX = (W - qrSize) / 2;
  const qrY = 580;
  
  const qrDiv = $('qr-code-hidden');
  qrDiv.innerHTML = '';
  new QRCode(qrDiv, { 
    text: url, 
    width: qrSize * 2, 
    height: qrSize * 2, 
    colorDark: "#1e293b", 
    colorLight: "#ffffff", 
    correctLevel: QRCode.CorrectLevel.H 
  });

  await new Promise(resolve => {
    const check = () => {
      const source = qrDiv.querySelector('canvas') || qrDiv.querySelector('img');
      if (source) {
        if (source.tagName === 'IMG' && !source.complete) {
          source.onload = resolve;
          source.onerror = resolve;
        } else {
          resolve();
        }
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });

  const qrSource = qrDiv.querySelector('canvas') || qrDiv.querySelector('img');
  if (qrSource) {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
    ctx.drawImage(qrSource, qrX, qrY, qrSize, qrSize);
  }

  // 底部文字
  ctx.fillStyle = '#94a3b8'; ctx.font = '24px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('长按识别二维码 · 给我写信', W/2, 900);
  ctx.fillStyle = '#cbd5e1'; ctx.font = '16px sans-serif';
  ctx.fillText('Tell · 匿名悄悄话', W/2, 940);

  // 输出
  const wrapper = $('poster-wrapper');
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  img.style.maxWidth = '260px'; 
  img.style.borderRadius = '16px'; 
  img.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
  wrapper.innerHTML = ''; 
  wrapper.appendChild(img);
}
function savePoster() {
  const canvas = $('poster-canvas');
  const link = document.createElement('a');
  link.download = 'tell-poster.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  toast('💾 海报已保存', 'success');
}
function copyShareText() {
  const profile = JSON.parse(localStorage.getItem('tell_profile') || '{}');
  const url = getShareUrl();
  const text = '🤫 想对' + (profile.name||'我') + '说什么？点击写匿名信给我 💌\\n' + url;
  navigator.clipboard.writeText(text).then(() => toast('✅ 文案已复制', 'success'));
}
function shareTo(platform) {
  const profile = JSON.parse(localStorage.getItem('tell_profile') || '{}');
  const url = getShareUrl();
  const name = profile.name || '我';
  const texts = {
    wechat: { copy: '🤫 对' + name + '说悄悄话（完全匿名）💌 ' + url, tip: '文案已复制 ✅\\n粘贴给好友或朋友圈' },
    qq: { copy: '🤫 匿名信给' + name + ' 💌 ' + url, tip: '文案已复制 ✅\\n粘贴给好友' },
    xhs: { copy: '🤫 收匿名信啦！想对' + name + '说什么？🔒端到端加密 💌链接在评论区 #匿名信', tip: '文案已复制 ✅\\n发笔记时上传海报+粘贴文案' },
    douyin: { copy: '🤫 匿名提问箱！链接在评论区👇 #匿名', tip: '文案已复制 ✅\\n发视频时粘贴文案' },
    weibo: { url: 'https://service.weibo.com/share/share.php?title=' + encodeURIComponent('🤫写匿名信给' + name) + '&url=' + encodeURIComponent(url) }
  };
  const cfg = texts[platform];
  if(cfg.url) { window.open(cfg.url); return; }
  navigator.clipboard.writeText(cfg.copy).then(() => { closeShareModal(); showPlatformTip(platform, cfg.tip); });
}
function showPlatformTip(platform, tip) {
  const names = {wechat:'微信',qq:'QQ',xhs:'小红书',douyin:'抖音',weibo:'微博'};
  const modal = $('share-modal');
  modal.innerHTML = \`<div class="modal-overlay" onclick="if(event.target===this)closeShareModal()"><div class="modal-content text-center"><div class="text-5xl mb-4">\${platform==='wechat'?'💬':platform==='qq'?'🐧':platform==='xhs'?'📕':platform==='douyin'?'🎵':'🔥'}</div><h3 class="text-lg font-bold mb-2">分享到\${names[platform]}</h3><div class="text-sm text-gray-500 mb-6 whitespace-pre-line">\${escapeHtml(tip)}</div><button onclick="closeShareModal()" class="w-full py-3 bg-gray-100 rounded-xl font-bold btn-press">👌 知道了</button></div></div>\`;
  modal.classList.remove('hidden');
}

// ==================== 备份恢复 ====================
function exportBackup() {
  const data = { v:5, pub:localStorage.getItem('tell_pub'), pri:localStorage.getItem('tell_pri'), addr:localStorage.getItem('tell_addr'), profile:JSON.parse(localStorage.getItem('tell_profile')||'{}') };
  const blob = new Blob([JSON.stringify(data)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='tell-backup.json'; a.click(); toast('📦 备份已下载','success');
}
function importBackup() { $('file-import').click(); }
async function handleImportFile(e) {
  const f = e.target.files[0]; if(!f) return;
  try {
    const d = JSON.parse(await f.text());
    if(!d.pub || !d.pri) throw new Error('无效文件');
    localStorage.setItem('tell_pub',d.pub); localStorage.setItem('tell_pri',d.pri); localStorage.setItem('tell_addr',d.addr); localStorage.setItem('tell_profile',JSON.stringify(d.profile));
    await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:d.addr, pub:d.pub, profile:d.profile}) });
    loadProfile(); toast('✅ 恢复成功','success');
  } catch(err) { toast('❌ 失败','error'); }
  e.target.value = '';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

</script>
</body>
</html>`;

// ==================== Cloudflare Worker 后端逻辑（完整合并版） ====================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. 处理 CORS (跨域允许)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // 响应助手函数
    const json = (d, s = 200) => new Response(JSON.stringify(d), { 
      status: s, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
    const err = (m, s = 400) => json({ error: m }, s);

    // 2. API: 注册身份 (/api/register) - 用于保存昵称和头像
    if (url.pathname === '/api/register' && request.method === 'POST') {
      try {
        const { id, pub, profile } = await request.json();
        if (!id || !pub) return err('Missing data');
        await env.TELL_DB.put('pubkey:' + id, pub);
        if (profile) {
          await env.TELL_DB.put('profile:' + id, JSON.stringify(profile));
        }
        return json({ ok: true });
      } catch (e) { return err(e.message, 500); }
    }

    // 3. API: 解析短 ID (/api/resolve) - 朋友点开链接时获取你的资料
    if (url.pathname === '/api/resolve' && request.method === 'GET') {
      const id = url.searchParams.get('id');
      if (!id) return err('Missing id');
      const [pub, pro] = await Promise.all([
        env.TELL_DB.get('pubkey:' + id),
        env.TELL_DB.get('profile:' + id)
      ]);
      if (!pub) return err('Not found', 404);
      return json({ pub, profile: pro ? JSON.parse(pro) : null });
    }

    // 4. API: 发送加密消息 (/api/send)
    if (url.pathname === '/api/send' && request.method === 'POST') {
      try {
        const { to, data } = await request.json();
        if (!to || !data) return err('Missing fields');
        // 消息 Key 格式: msg:{收件人哈希}:{时间戳}_{随机数}
        const key = 'msg:' + to + ':' + Date.now() + '_' + Math.random().toString(36).slice(2);
        // 存储 7 天过期
        await env.TELL_DB.put(key, data, { expirationTtl: 604800 });
        return json({ ok: true });
      } catch (e) { return err(e.message, 500); }
    }

    // 5. API: 获取收信箱 (/api/inbox)
    if (url.pathname === '/api/inbox') {
      try {
        const addr = url.searchParams.get('addr');
        if (!addr) return err('Missing addr');
        const limit = parseInt(url.searchParams.get('limit')) || 15;
        const cursor = url.searchParams.get('cursor');

        const list = await env.TELL_DB.list({ prefix: 'msg:' + addr + ':', limit, cursor });
        const msgs = await Promise.all(list.keys.map(async k => {
          const v = await env.TELL_DB.get(k.name);
          // 提取 Key 中的时间戳
          const ts = k.name.split(':')[2].split('_')[0];
          return { ts, data: v };
        }));

        // 按时间倒序
        msgs.sort((a, b) => Number(b.ts) - Number(a.ts));
        return json({ msgs, cursor: list.list_complete ? null : list.cursor });
      } catch (e) { return err(e.message, 500); }
    }

    // 6. 返回前端 HTML 页面 (带安全策略)
    return new Response(html, { 
      headers: { 
        'Content-Type': 'text/html;charset=UTF-8',
        // 必须加上这个 CSP，否则浏览器会拦截 qrcode.js 的加载
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self';"
      } 
    });
  }
};
