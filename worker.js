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

*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/*! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.container{width:100%}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.fixed{position:fixed}.bottom-0{bottom:0}.top-0{top:0}.z-50{z-index:50}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.mt-1{margin-top:.25rem}.mt-16{margin-top:4rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.block{display:block}.flex{display:flex}.hidden{display:none}.h-1\.5{height:.375rem}.h-14{height:3.5rem}.h-16{height:4rem}.h-28{height:7rem}.h-4{height:1rem}.h-48{height:12rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-px{height:1px}.min-h-screen{min-height:100vh}.w-1\.5{width:.375rem}.w-16{width:4rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-full{width:100%}.max-w-lg{max-width:32rem}.flex-1{flex:1 1 0%}@keyframes pulse{50%{opacity:.5}}.animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes spin{to{transform:rotate(1turn)}}.animate-spin{animation:spin 1s linear infinite}.resize-none{resize:none}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.gap-0\.5{gap:.125rem}.gap-1\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem*var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem*var(--tw-space-y-reverse))}.overflow-hidden{overflow:hidden}.whitespace-pre-line{white-space:pre-line}.whitespace-pre-wrap{white-space:pre-wrap}.break-words{overflow-wrap:break-word}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-t{border-top-width:1px}.border-gray-100{--tw-border-opacity:1;border-color:rgb(243 244 246/var(--tw-border-opacity,1))}.border-gray-200{--tw-border-opacity:1;border-color:rgb(229 231 235/var(--tw-border-opacity,1))}.border-gray-200\/50{border-color:rgba(229,231,235,.5)}.bg-\[\#07c160\]\/10{background-color:rgba(7,193,96,.1)}.bg-\[\#12b7f5\]\/10{background-color:rgba(18,183,245,.1)}.bg-\[\#ff2442\]\/10{background-color:rgba(255,36,66,.1)}.bg-\[\#ff8200\]\/10{background-color:rgba(255,130,0,.1)}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity,1))}.bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity,1))}.bg-green-50{--tw-bg-opacity:1;background-color:rgb(240 253 244/var(--tw-bg-opacity,1))}.bg-green-500{--tw-bg-opacity:1;background-color:rgb(34 197 94/var(--tw-bg-opacity,1))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1))}.bg-white\/80{background-color:hsla(0,0%,100%,.8)}.bg-white\/90{background-color:hsla(0,0%,100%,.9)}.bg-wx{--tw-bg-opacity:1;background-color:rgb(7 193 96/var(--tw-bg-opacity,1))}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.px-1{padding-left:.25rem;padding-right:.25rem}.px-2\.5{padding-left:.625rem;padding-right:.625rem}.px-4{padding-left:1rem;padding-right:1rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.px-8{padding-left:2rem;padding-right:2rem}.py-0\.5{padding-top:.125rem;padding-bottom:.125rem}.py-16{padding-top:4rem;padding-bottom:4rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-2\.5{padding-top:.625rem;padding-bottom:.625rem}.py-20{padding-top:5rem;padding-bottom:5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-3\.5{padding-top:.875rem;padding-bottom:.875rem}.py-4{padding-top:1rem;padding-bottom:1rem}.pb-2{padding-bottom:.5rem}.pt-2{padding-top:.5rem}.text-left{text-align:left}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-5xl{font-size:3rem;line-height:1}.text-6xl{font-size:3.75rem;line-height:1}.text-\[10px\]{font-size:10px}.text-\[11px\]{font-size:11px}.text-\[15px\]{font-size:15px}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-black{font-weight:900}.font-bold{font-weight:700}.font-medium{font-weight:500}.uppercase{text-transform:uppercase}.leading-relaxed{line-height:1.625}.tracking-wider{letter-spacing:.05em}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175/var(--tw-text-opacity,1))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity,1))}.text-gray-700{--tw-text-opacity:1;color:rgb(55 65 81/var(--tw-text-opacity,1))}.text-gray-800{--tw-text-opacity:1;color:rgb(31 41 55/var(--tw-text-opacity,1))}.text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39/var(--tw-text-opacity,1))}.text-green-600{--tw-text-opacity:1;color:rgb(22 163 74/var(--tw-text-opacity,1))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.text-wx{--tw-text-opacity:1;color:rgb(7 193 96/var(--tw-text-opacity,1))}.opacity-25{opacity:.25}.opacity-75{opacity:.75}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.shadow-lg,.shadow-sm{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgba(0,0,0,.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-green-500\/25{--tw-shadow-color:rgba(34,197,94,.25);--tw-shadow:var(--tw-shadow-colored)}.outline-none{outline:2px solid transparent;outline-offset:2px}.backdrop-blur-xl{--tw-backdrop-blur:blur(24px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.ease-in{transition-timing-function:cubic-bezier(.4,0,1,1)}.hover\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity,1))}.hover\:bg-gray-50:hover{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity,1))}.hover\:bg-green-600:hover{--tw-bg-opacity:1;background-color:rgb(22 163 74/var(--tw-bg-opacity,1))}.focus\:border-green-500:focus{--tw-border-opacity:1;border-color:rgb(34 197 94/var(--tw-border-opacity,1))}.focus\:ring-2:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus\:ring-green-500\/50:focus{--tw-ring-color:rgba(34,197,94,.5)}.disabled\:opacity-50:disabled{opacity:.5}.dark\:border-gray-700:is(.dark *){--tw-border-opacity:1;border-color:rgb(55 65 81/var(--tw-border-opacity,1))}.dark\:border-gray-700\/50:is(.dark *){border-color:rgba(55,65,81,.5)}.dark\:bg-darkbg:is(.dark *){--tw-bg-opacity:1;background-color:rgb(15 23 42/var(--tw-bg-opacity,1))}.dark\:bg-gray-700:is(.dark *){--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity,1))}.dark\:bg-gray-700\/50:is(.dark *){background-color:rgba(55,65,81,.5)}.dark\:bg-gray-800:is(.dark *){--tw-bg-opacity:1;background-color:rgb(31 41 55/var(--tw-bg-opacity,1))}.dark\:bg-gray-800\/80:is(.dark *){background-color:rgba(31,41,55,.8)}.dark\:bg-gray-900\/50:is(.dark *){background-color:rgba(17,24,39,.5)}.dark\:bg-gray-900\/80:is(.dark *){background-color:rgba(17,24,39,.8)}.dark\:bg-gray-900\/90:is(.dark *){background-color:rgba(17,24,39,.9)}.dark\:bg-green-900\/30:is(.dark *){background-color:rgba(20,83,45,.3)}.dark\:text-gray-100:is(.dark *){--tw-text-opacity:1;color:rgb(243 244 246/var(--tw-text-opacity,1))}.dark\:text-gray-200:is(.dark *){--tw-text-opacity:1;color:rgb(229 231 235/var(--tw-text-opacity,1))}.dark\:text-green-400:is(.dark *){--tw-text-opacity:1;color:rgb(74 222 128/var(--tw-text-opacity,1))}.dark\:hover\:bg-gray-700:hover:is(.dark *){--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity,1))}.dark\:hover\:bg-gray-700\/50:hover:is(.dark *){background-color:rgba(55,65,81,.5)}
</style>
<script>
var QRCode;!function(){function a(a){this.mode=c.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=[],d=0,e=this.data.length;e>d;d++){var f=this.data.charCodeAt(d);f>65536?(b[0]=240|(1835008&f)>>>18,b[1]=128|(258048&f)>>>12,b[2]=128|(4032&f)>>>6,b[3]=128|63&f):f>2048?(b[0]=224|(61440&f)>>>12,b[1]=128|(4032&f)>>>6,b[2]=128|63&f):f>128?(b[0]=192|(1984&f)>>>6,b[1]=128|63&f):b[0]=f,this.parsedData=this.parsedData.concat(b)}this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function j(a,b){this.totalCount=a,this.dataCount=b}function k(){this.buffer=[],this.length=0}function m(){return"undefined"!=typeof CanvasRenderingContext2D}function n(){var a=!1,b=navigator.userAgent;return/android/i.test(b)&&(a=!0,aMat=b.toString().match(/android ([0-9]\\.[0-9])/i),aMat&&aMat[1]&&(a=parseFloat(aMat[1]))),a}function r(a,b){for(var c=1,e=s(a),f=0,g=l.length;g>=f;f++){var h=0;switch(b){case d.L:h=l[f][0];break;case d.M:h=l[f][1];break;case d.Q:h=l[f][2];break;case d.H:h=l[f][3]}if(h>=e)break;c++}if(c>l.length)throw new Error("Too long data");return c}function s(a){var b=encodeURI(a).toString().replace(/\\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}a.prototype={getLength:function(){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b){var c=new a(b);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(this.modules[a+c][b+d]=c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?!0:!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=f.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=0==b%2)},setupPositionAdjustPattern:function(){for(var a=f.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var g=-2;2>=g;g++)for(var h=-2;2>=h;h++)this.modules[d+g][e+h]=-2==g||2==g||-2==h||2==h||0==g&&0==h?!0:!1}},setupTypeNumber:function(a){for(var b=f.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=f.getBCHTypeInfo(c),e=0;15>e;e++){var g=!a&&1==(1&d>>e);6>e?this.modules[e][8]=g:8>e?this.modules[e+1][8]=g:this.modules[this.moduleCount-15+e][8]=g}for(var e=0;15>e;e++){var g=!a&&1==(1&d>>e);8>e?this.modules[8][this.moduleCount-e-1]=g:9>e?this.modules[8][15-e-1+1]=g:this.modules[8][15-e-1]=g}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,g=0,h=this.moduleCount-1;h>0;h-=2)for(6==h&&h--;;){for(var i=0;2>i;i++)if(null==this.modules[d][h-i]){var j=!1;g<a.length&&(j=1==(1&a[g]>>>e));var k=f.getMask(b,d,h-i);k&&(j=!j),this.modules[d][h-i]=j,e--,-1==e&&(g++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,d){for(var e=j.getRSBlocks(a,c),g=new k,h=0;h<d.length;h++){var i=d[h];g.put(i.mode,4),g.put(i.getLength(),f.getLengthInBits(i.mode,a)),i.write(g)}for(var l=0,h=0;h<e.length;h++)l+=e[h].dataCount;if(g.getLengthInBits()>8*l)throw new Error("code length overflow. ("+g.getLengthInBits()+">"+8*l+")");for(g.getLengthInBits()+4<=8*l&&g.put(0,4);0!=g.getLengthInBits()%8;)g.putBit(!1);for(;;){if(g.getLengthInBits()>=8*l)break;if(g.put(b.PAD0,8),g.getLengthInBits()>=8*l)break;g.put(b.PAD1,8)}return b.createBytes(g,e)},b.createBytes=function(a,b){for(var c=0,d=0,e=0,g=new Array(b.length),h=new Array(b.length),j=0;j<b.length;j++){var k=b[j].dataCount,l=b[j].totalCount-k;d=Math.max(d,k),e=Math.max(e,l),g[j]=new Array(k);for(var m=0;m<g[j].length;m++)g[j][m]=255&a.buffer[m+c];c+=k;var n=f.getErrorCorrectPolynomial(l),o=new i(g[j],n.getLength()-1),p=o.mod(n);h[j]=new Array(n.getLength()-1);for(var m=0;m<h[j].length;m++){var q=m+p.getLength()-h[j].length;h[j][m]=q>=0?p.get(q):0}}for(var r=0,m=0;m<b.length;m++)r+=b[m].totalCount;for(var s=new Array(r),t=0,m=0;d>m;m++)for(var j=0;j<b.length;j++)m<g[j].length&&(s[t++]=g[j][m]);for(var m=0;e>m;m++)for(var j=0;j<b.length;j++)m<h[j].length&&(s[t++]=h[j][m]);return s};for(var c={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},d={L:1,M:0,Q:3,H:2},e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;f.getBCHDigit(b)-f.getBCHDigit(f.G15)>=0;)b^=f.G15<<f.getBCHDigit(b)-f.getBCHDigit(f.G15);return(a<<10|b)^f.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;f.getBCHDigit(b)-f.getBCHDigit(f.G18)>=0;)b^=f.G18<<f.getBCHDigit(b)-f.getBCHDigit(f.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return f.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case e.PATTERN000:return 0==(b+c)%2;case e.PATTERN001:return 0==b%2;case e.PATTERN010:return 0==c%3;case e.PATTERN011:return 0==(b+c)%3;case e.PATTERN100:return 0==(Math.floor(b/2)+Math.floor(c/3))%2;case e.PATTERN101:return 0==b*c%2+b*c%3;case e.PATTERN110:return 0==(b*c%2+b*c%3)%2;case e.PATTERN111:return 0==(b*c%3+(b+c)%2)%2;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new i([1],0),c=0;a>c;c++)b=b.multiply(new i([1,g.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case c.MODE_NUMBER:return 10;case c.MODE_ALPHA_NUM:return 9;case c.MODE_8BIT_BYTE:return 8;case c.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case c.MODE_NUMBER:return 12;case c.MODE_ALPHA_NUM:return 11;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case c.MODE_NUMBER:return 14;case c.MODE_ALPHA_NUM:return 13;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||(0!=h||0!=i)&&g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,(0==j||4==j)&&(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},g={glog:function(a){if(1>a)throw new Error("glog("+a+")");return g.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return g.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},h=0;8>h;h++)g.EXP_TABLE[h]=1<<h;for(var h=8;256>h;h++)g.EXP_TABLE[h]=g.EXP_TABLE[h-4]^g.EXP_TABLE[h-5]^g.EXP_TABLE[h-6]^g.EXP_TABLE[h-8];for(var h=0;255>h;h++)g.LOG_TABLE[g.EXP_TABLE[h]]=h;i.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=g.gexp(g.glog(this.get(c))+g.glog(a.get(d)));return new i(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=g.glog(this.get(0))-g.glog(a.get(0)),c=new Array(this.getLength()),d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=g.gexp(g.glog(a.get(d))+b);return new i(c,0).mod(a)}},j.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],j.getRSBlocks=function(a,b){var c=j.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,e=[],f=0;d>f;f++)for(var g=c[3*f+0],h=c[3*f+1],i=c[3*f+2],k=0;g>k;k++)e.push(new j(h,i));return e},j.getRsBlockTable=function(a,b){switch(b){case d.L:return j.RS_BLOCK_TABLE[4*(a-1)+0];case d.M:return j.RS_BLOCK_TABLE[4*(a-1)+1];case d.Q:return j.RS_BLOCK_TABLE[4*(a-1)+2];case d.H:return j.RS_BLOCK_TABLE[4*(a-1)+3];default:return void 0}},k.prototype={get:function(a){var b=Math.floor(a/8);return 1==(1&this.buffer[b]>>>7-a%8)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(1&a>>>b-c-1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var l=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],o=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function g(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var b=this._htOption,c=this._el,d=a.getModuleCount();Math.floor(b.width/d),Math.floor(b.height/d),this.clear();var h=g("svg",{viewBox:"0 0 "+String(d)+" "+String(d),width:"100%",height:"100%",fill:b.colorLight});h.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),c.appendChild(h),h.appendChild(g("rect",{fill:b.colorDark,width:"1",height:"1",id:"template"}));for(var i=0;d>i;i++)for(var j=0;d>j;j++)if(a.isDark(i,j)){var k=g("use",{x:String(i),y:String(j)});k.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),h.appendChild(k)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),p="svg"===document.documentElement.tagName.toLowerCase(),q=p?o:m()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function d(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&_fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",void 0}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var b=1/window.devicePixelRatio,c=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,d,e,f,g,h,i,j){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*b;else"undefined"==typeof j&&(arguments[1]*=b,arguments[2]*=b,arguments[3]*=b,arguments[4]*=b);c.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=n(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&d.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();QRCode=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:d.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._android=n(),this._el=a,this._oQRCode=null,this._oDrawing=new q(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},QRCode.prototype.makeCode=function(a){this._oQRCode=new b(r(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=d}();
</script>
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
  if (!window.crypto || !window.crypto.subtle) {
    return toast('浏览器不支持加密 API，请确保使用 HTTPS 访问', 'error');
  }
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
  } catch(e) { console.error('createIdentity error:', e); toast('创建失败: ' + e.message, 'error'); }
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
  if(!toAddr || !/^[0-9a-f]{16}$/.test(toAddr)) return;
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

    // 1.5 强制 HTTPS 重定向
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
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
        // CSP 需要 'unsafe-inline' 以支持内联的 JS 和 CSS（已将所有外部 CDN 依赖内联）
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self';"
      } 
    });
  }
};
