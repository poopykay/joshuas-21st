/* ===================== Config ===================== */
const STAGE_W = 1366, STAGE_H = 768;

const LADYBUG = {
  3:  {left:85.3, top:72.1, w:3.6, h:10},
  4:  {left:87,   top:80,   w:5,   h:10},
  5:  {left:88.8, top:30.1, w:6,   h:11},
  6:  {left:86.4, top:77.7, w:5.8, h:10.4},
  7:  {left:85.7, top:80.3, w:5.8, h:10.6},
  8:  {left:87.7, top:77.6, w:5.7, h:10.6},
  9:  {left:89,   top:80,   w:5,   h:10},
  11: {left:86.1, top:82.3, w:4.1, h:11.3},
  12: {left:86.2, top:17.7, w:5,   h:12.5},
  13: {left:88.4, top:78.9, w:4.6, h:11.6},
  14: {left:85.9, top:76,   w:4.9, h:13.3},
  15: {left:38,   top:76,   w:5,   h:10},
  16: {left:77.2, top:38.4, w:8.1, h:15.2},
};

// friend template zones (percentages of 1366x768 stage)
const TEMPLATES = {
  journal: {
    bg: 3,
    nameZone: {left:30, top:44, w:19, h:12},
    hasEnvelope: false,
  },
  box: {
    bg: 4,
    photoZone: {left:5, top:4, w:66, h:48},
    envelope: {left:31, top:54, w:35, h:37},
    nameZone: {left:36, top:70, w:26, h:14},
  },
  clothesline: {
    bg: 5,
    photoZone: {left:2, top:20, w:69, h:62},
    envelope: {left:71, top:50, w:27, h:36},
    nameZone: {left:75, top:66, w:20, h:13},
  },
  corkboard: {
    bg: 6,
    photoZone: {left:16, top:9, w:68, h:62},
    envelope: {left:36, top:50, w:28, h:33},
    nameZone: {left:41, top:64, w:19, h:12},
  },
  magnet: {
    bg: 7,
    photoZone: {left:4, top:6, w:60, h:84},
    envelope: {left:66, top:30, w:31, h:42},
    nameZone: {left:70, top:44, w:23, h:15},
  },
  jeans: {
    bg: 8,
    photoZone: {left:52, top:16, w:43, h:64, single:true, rot:2},
    envelope: {left:2, top:16, w:35, h:48},
    nameZone: {left:6, top:31, w:26, h:16},
  },
  camera: {
    bg: 9,
    photoZone: {left:15.5, top:23, w:21.5, h:40, single:true, rot:0},
    envelope: {left:51, top:31, w:29, h:42},
    nameZone: {left:56, top:45, w:20, h:15},
  },
};

const FAMILY_BG = {matin:11, "rachel-sister":12, "emma-uwu-ling":13, "daddy-ling":14, "mummud":15};
const FAMILY_PHOTO_ZONE = {
  matin:          {cx:66.52, cy:51.06, w:18.18, h:47.32, rot:3.01},
  "rachel-sister":{cx:31.13, cy:40.47, w:34.08, h:41.40, rot:-7.16},
  "emma-uwu-ling":{cx:28.31, cy:57.47, w:29.76, h:36.14, rot:8.97},
  "daddy-ling":   {cx:67.70, cy:35.22, w:30.40, h:36.91, rot:6.34},
  "mummud":       {cx:28.58, cy:37.25, w:34.03, h:41.40, rot:-8.13},
};
// envelope hotspot roughly opposite the photo stack (for opening the letter)
const FAMILY_ENV_ZONE = {
  matin:          {left:4,  top:22, w:38, h:56},
  "rachel-sister":{left:58, top:20, w:38, h:60},
  "emma-uwu-ling":{left:58, top:24, w:38, h:60},
  "daddy-ling":   {left:5,  top:18, w:38, h:60},
  "mummud":       {left:56, top:16, w:40, h:64},
};

/* ===================== Build sequence ===================== */
const DATA = window.DATA;
const FAMILY_ORDER = ["matin","rachel-sister","emma-uwu-ling","daddy-ling","mummud","kay-3"];

let seq = [];
seq.push({type:"intro1"});
seq.push({type:"intro2"});
DATA.friends.forEach(f => seq.push({type:"friend", data:f}));
seq.push({type:"transition"});
FAMILY_ORDER.forEach(slug => {
  if (slug === "kay-3") { seq.push({type:"kay", data:DATA.family.find(x=>x.slug===slug)}); }
  else seq.push({type:"family", data:DATA.family.find(x=>x.slug===slug)});
});
seq.push({type:"finale"});

let current = 0;
const stage = document.getElementById("stage");
const slideEls = [];

/* ===================== Helpers ===================== */
function pct(v){ return v + "%"; }

function el(tag, cls, styleObj){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (styleObj) Object.assign(e.style, styleObj);
  return e;
}

function setZoneStyle(node, z){
  node.style.left = pct(z.left);
  node.style.top = pct(z.top);
  node.style.width = pct(z.w);
  node.style.height = pct(z.h);
}

function goTo(index){
  if (index < 0 || index >= seq.length) return;
  if (slideEls[current]) slideEls[current].classList.remove("active");
  current = index;
  if (!slideEls[current]) buildSlide(current);
  slideEls[current].classList.add("active");
  if (seq[current].type === "finale") initCandles();
}
function next(){ goTo(current+1); }
function prev(){ goTo(current-1); }

function addBackZone(slide){
  if (current === 0) return;
  const z = el("div","zone-back");
  z.addEventListener("click", (e)=>{ e.stopPropagation(); prev(); });
  slide.appendChild(z);
}

function addLadybug(slide, bgNum, onClick){
  const zone = LADYBUG[bgNum];
  if (!zone) return;
  const bug = el("div","tap-hotspot");
  setZoneStyle(bug, zone);
  bug.addEventListener("click", (e)=>{ e.stopPropagation(); onClick(); });
  slide.appendChild(bug);
}

function bgUrl(n){ return `url('assets/backgrounds/${n}.jpg')`; }

/* ===================== Letter popup ===================== */
const letterOverlay = document.getElementById("letter-overlay");
const letterCard = document.getElementById("letter-card");
const letterCoverImg = document.getElementById("letter-cover-img");
const letterCover = document.getElementById("letter-cover");
const letterMessage = document.getElementById("letter-message");
let letterHasCover = true;

function openLetter(message, coverImgSrc){
  letterMessage.textContent = message;
  letterCard.classList.remove("flipped");
  if (coverImgSrc){
    letterHasCover = true;
    letterCoverImg.src = coverImgSrc;
    letterCover.style.display = "flex";
  } else {
    letterHasCover = false;
    letterCover.style.display = "none";
    letterCard.classList.add("flipped");
  }
  letterOverlay.classList.remove("hidden");
}
letterCover.addEventListener("click", ()=> letterCard.classList.add("flipped"));
letterOverlay.addEventListener("click", (e)=>{
  if (e.target === letterOverlay) letterOverlay.classList.add("hidden");
});
document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape"){
    letterOverlay.classList.add("hidden");
    document.getElementById("lightbox").classList.add("hidden");
  }
});

/* ===================== Lightbox ===================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
function openLightbox(src){
  lightboxImg.src = src;
  lightbox.classList.remove("hidden");
}
lightbox.addEventListener("click", ()=> lightbox.classList.add("hidden"));

/* ===================== Photo layout (flex-wrap grid within a zone) ===================== */
function layoutPhotosInZone(container, zone, photos, frameStyle){
  const wrap = el("div", null, {
    position:"absolute", left:pct(zone.left), top:pct(zone.top),
    width:pct(zone.w), height:pct(zone.h),
    display:"flex", flexWrap:"wrap", alignContent:"flex-start",
    alignItems:"flex-start", justifyContent:"center",
    gap: "1.2%", padding: "1%", zIndex: 20,
  });
  const n = photos.length;
  const cols = n <= 1 ? 1 : n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const itemW = `${Math.floor(92/cols)}%`;
  photos.forEach((src, i) => {
    const rot = (i % 2 === 0 ? -1 : 1) * (3 + (i*7 % 6));
    const frame = el("div", "photo-frame" + (frameStyle==="clean" ? " no-caption":""), {
      width: itemW, aspectRatio: "1/1",
      transform: `rotate(${rot}deg)`,
    });
    const img = document.createElement("img");
    img.src = src; img.loading = "lazy";
    frame.appendChild(img);
    frame.addEventListener("click", (e)=>{ e.stopPropagation(); openLightbox(src); });
    wrap.appendChild(frame);
    if (frameStyle === "pin"){
      const pin = el("img","pin", {left:"46%", top:"-16px", width:"28px", height:"auto"});
      pin.src = "assets/props/pin.png";
      pin.onerror = ()=> pin.remove();
      frame.style.overflow = "visible";
      frame.appendChild(pin);
    }
    if (frameStyle === "magnet"){
      const mg = el("img","magnet-icon", {left:"44%", top:"-10px", width:"24px", height:"auto"});
      mg.src = "assets/props/magnet.png";
      mg.onerror = ()=> mg.remove();
      frame.style.overflow = "visible";
      frame.appendChild(mg);
    }
  });
  container.appendChild(wrap);
}

function singlePhotoInZone(container, zone, src){
  const frame = el("div","photo-frame no-caption", {});
  setZoneStyle(frame, zone);
  frame.style.transform = `rotate(${zone.rot||0}deg)`;
  frame.style.zIndex = 20;
  const img = document.createElement("img");
  img.src = src;
  frame.appendChild(img);
  frame.addEventListener("click", (e)=>{ e.stopPropagation(); openLightbox(src); });
  container.appendChild(frame);
}

/* ===================== Slide builders ===================== */
function buildSlide(index){
  const spec = seq[index];
  const slide = el("div","slide");
  slide.style.backgroundImage = "";

  if (spec.type === "intro1"){
    slide.style.backgroundImage = bgUrl(1);
    const hotspot = el("div","tap-hotspot", {left:"8%", top:"48%", width:"18%", height:"40%"});
    hotspot.addEventListener("click", (e)=>{ e.stopPropagation(); next(); });
    slide.appendChild(hotspot);
  }

  else if (spec.type === "intro2"){
    slide.style.backgroundImage = bgUrl(2);
    const layer = el("div","click-anywhere-layer");
    layer.addEventListener("click", ()=> next());
    slide.appendChild(layer);
  }

  else if (spec.type === "transition"){
    slide.style.backgroundImage = bgUrl(10);
    addBackZone(slide);
    addLadybug(slide, 10, next);
  }

  else if (spec.type === "friend"){
    const f = spec.data;
    const tpl = TEMPLATES[f.template];
    slide.style.backgroundImage = bgUrl(tpl.bg);
    addBackZone(slide);

    // photos
    if (f.photo_web && f.photo_web.length){
      if (tpl.photoZone && tpl.photoZone.single){
        singlePhotoInZone(slide, tpl.photoZone, f.photo_web[0]);
      } else if (tpl.photoZone) {
        const style = f.template === "corkboard" ? "pin" : (f.template === "magnet" ? "magnet" : "plain");
        layoutPhotosInZone(slide, tpl.photoZone, f.photo_web, style);
      }
    }

    // envelope + name + letter
    if (tpl.hasEnvelope === false){
      // journal: name directly clickable, opens message with no cover
      const nameWrap = el("div","envelope-wrap");
      setZoneStyle(nameWrap, tpl.nameZone);
      if (f.name_asset){
        const img = document.createElement("img");
        img.src = f.name_asset;
        Object.assign(img.style, {width:"100%", height:"100%", objectFit:"contain"});
        nameWrap.appendChild(img);
      }
      nameWrap.addEventListener("click", (e)=>{ e.stopPropagation(); openLetter(f.message, null); });
      slide.appendChild(nameWrap);
    } else {
      const envWrap = el("div","envelope-wrap");
      setZoneStyle(envWrap, tpl.envelope);
      envWrap.addEventListener("click", (e)=>{
        e.stopPropagation();
        openLetter(f.message, f.name_asset);
      });
      slide.appendChild(envWrap);

      // name-zone coordinates are slide-relative, so append as a sibling (not nested in envWrap)
      const nameNode = el("div","card-name");
      setZoneStyle(nameNode, tpl.nameZone);
      nameNode.style.zIndex = 31;
      nameNode.style.cursor = "pointer";
      if (f.name_asset){
        const img = document.createElement("img");
        img.src = f.name_asset;
        nameNode.appendChild(img);
      }
      nameNode.addEventListener("click", (e)=>{
        e.stopPropagation();
        openLetter(f.message, f.name_asset);
      });
      slide.appendChild(nameNode);
    }

    addLadybug(slide, tpl.bg, next);
  }

  else if (spec.type === "family"){
    const f = spec.data;
    const bgNum = FAMILY_BG[f.slug];
    slide.style.backgroundImage = bgUrl(bgNum);
    addBackZone(slide);

    if (f.photo_web && f.photo_web.length){
      const z = FAMILY_PHOTO_ZONE[f.slug];
      const wrap = el("div", null, {
        position:"absolute",
        left: pct(z.cx - z.w/2), top: pct(z.cy - z.h/2),
        width: pct(z.w), height: pct(z.h),
        transform: `rotate(${z.rot}deg)`,
        zIndex: 20, cursor:"pointer",
      });
      const img = document.createElement("img");
      img.src = f.photo_web[0];
      Object.assign(img.style, {width:"100%",height:"100%",objectFit:"cover",
        boxShadow:"0 8px 20px rgba(0,0,0,0.4)", border:"8px solid #fff", boxSizing:"border-box"});
      wrap.appendChild(img);
      let pi = 0;
      wrap.addEventListener("click", (e)=>{
        e.stopPropagation();
        openLightbox(f.photo_web[pi % f.photo_web.length]);
        pi++;
      });
      if (f.photo_web.length > 1){
        const badge = el("div", null, {
          position:"absolute", right:"-4%", top:"-6%", background:"#c33", color:"#fff",
          borderRadius:"50%", width:"11%", aspectRatio:"1/1", display:"flex",
          alignItems:"center", justifyContent:"center", fontSize:"14px", fontFamily:"sans-serif",
          fontWeight:"bold", boxShadow:"0 2px 6px rgba(0,0,0,.4)"
        });
        badge.textContent = f.photo_web.length;
        wrap.appendChild(badge);
      }
      slide.appendChild(wrap);
    }

    const envZone = FAMILY_ENV_ZONE[f.slug];
    if (envZone){
      const hot = el("div","tap-hotspot");
      setZoneStyle(hot, envZone);
      hot.addEventListener("click", (e)=>{ e.stopPropagation(); openLetter(f.message, null); });
      slide.appendChild(hot);
    }

    addLadybug(slide, bgNum, next);
  }

  else if (spec.type === "kay"){
    buildKaySlide(slide, spec.data);
  }

  else if (spec.type === "finale"){
    slide.style.backgroundImage = bgUrl(17);
    addBackZone(slide);
    buildCandles(slide);
  }

  stage.appendChild(slide);
  slideEls[index] = slide;
}

/* ===================== Kay slide (photostrip) ===================== */
function buildKaySlide(slide, f){
  slide.style.backgroundImage = bgUrl(16);
  addBackZone(slide);

  // scrollable filmstrip in the center ladder area
  const stripBox = el("div","filmstrip-scroll", {
    left:"39%", top:"9%", width:"20%", height:"84%",
  });
  const track = el("div","filmstrip-track");
  (f.photo_web||[]).forEach(src=>{
    const frame = el("div","filmstrip-frame");
    const img = document.createElement("img");
    img.src = src;
    frame.appendChild(img);
    frame.addEventListener("click", (e)=>{ e.stopPropagation(); openLightbox(src); });
    track.appendChild(frame);
  });
  stripBox.appendChild(track);
  slide.appendChild(stripBox);

  // snoopy click zone (bottom-left, opens letter directly)
  const snoopy = el("div","tap-hotspot", {left:"1%", top:"48%", width:"30%", height:"50%"});
  snoopy.addEventListener("click", (e)=>{ e.stopPropagation(); openLetter(f.message, null); });
  slide.appendChild(snoopy);

  addLadybug(slide, 16, next);
}

/* ===================== Candle finale ===================== */
let candlesInit = false;
function buildCandles(slide){
  // 4 flame elements positioned above the cake in the finale background
  const flamePositions = [
    {left:41.5, top:23}, {left:49, top:23.5}, {left:56.5, top:23.5}, {left:63.5, top:24}
  ];
  window.__flames = [];
  flamePositions.forEach((p,i)=>{
    const f = el("div","candle-flame", {
      left: pct(p.left), top: pct(p.top), width:"3%", height:"6%",
      background: "radial-gradient(circle at 50% 70%, #ffdf7a 0%, #ffb238 45%, #ff8a1e 75%, transparent 80%)",
      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
      animationDelay: (i*0.13)+"s",
    });
    slide.appendChild(f);
    window.__flames.push(f);
  });
  const doneMsg = el("div","wish-done", {left:"20%", top:"85%", width:"60%", textAlign:"center"});
  doneMsg.id = "wish-done-msg";
  doneMsg.textContent = "Happy Birthday! 🎉 Wish granted.";
  slide.appendChild(doneMsg);
}

function initCandles(){
  if (candlesInit) return;
  candlesInit = true;
  navigator.mediaDevices?.getUserMedia({audio:true}).then(stream=>{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let blownCount = 0;
    const REQUIRED = 6;
    function tick(){
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i=0;i<data.length;i++) sum += data[i];
      const avg = sum/data.length;
      if (avg > 45){
        blownCount++;
      } else {
        blownCount = Math.max(0, blownCount-1);
      }
      if (blownCount >= REQUIRED){
        extinguishCandles();
        return;
      }
      requestAnimationFrame(tick);
    }
    tick();
  }).catch(()=>{
    // mic unavailable — allow click on flames as fallback
    (window.__flames||[]).forEach(f=> f.addEventListener("click", extinguishCandles));
  });
}
function extinguishCandles(){
  (window.__flames||[]).forEach(f=> f.classList.add("out"));
  const msg = document.getElementById("wish-done-msg");
  if (msg) msg.classList.add("show");
}

/* ===================== Stage scaling ===================== */
function scaleStage(){
  const vw = window.innerWidth, vh = window.innerHeight;
  const s = Math.min(vw/STAGE_W, vh/STAGE_H);
  stage.style.transform = `scale(${s})`;
}
window.addEventListener("resize", scaleStage);
scaleStage();

/* ===================== Init ===================== */
buildSlide(0);
slideEls[0].classList.add("active");
