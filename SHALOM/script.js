  // Navigation and animations for the birthday pages
document.addEventListener('DOMContentLoaded',()=>{
  const pages = document.querySelectorAll('.page');
  const navBtns = document.querySelectorAll('.page-btn');
  const openHeart = document.getElementById('openHeart');
  const toPage3 = document.getElementById('toPage3');
  const song = document.getElementById('song');

  function showPage(n){
    pages.forEach(p=>p.classList.remove('active'));
    navBtns.forEach(b=>b.classList.remove('active'));
    const target = document.querySelector('.page-'+n);
    const btn = document.querySelector('.page-btn[data-page="'+n+'"]');
    if(target) target.classList.add('active');
    if(btn) btn.classList.add('active');
    // auto-play song when opening page 2 after a user interaction
    if(n==2 && song && typeof song.play==='function'){
      song.currentTime = 0;
      song.play().catch(()=>{/* Autoplay blocked until interaction */});
    }
    // keep background song playing on all pages (do not pause on page 3)
  }

  navBtns.forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));

  // Heart click opens page 2
  openHeart && openHeart.addEventListener('click',()=>{
    // small pulse
    openHeart.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:420});
    showPage(2);
  });

  // Page 2 -> Page 3
  toPage3 && toPage3.addEventListener('click',()=>showPage(3));

  // Floating letters generator
  const lettersArea = document.getElementById('letters');
  const letters = 'I LOVE YOU ❤️*';
  function spawnLetter(){
    if(!lettersArea) return;
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = letters[Math.floor(Math.random()*letters.length)];
    const left = Math.random()*100;
    span.style.left = left+'%';
    span.style.fontSize = (12 + Math.random()*24)+'px';
    span.style.animationDuration = (4 + Math.random()*6)+'s';
    lettersArea.appendChild(span);
    setTimeout(()=>{span.remove();},9000);
  }
  // produce a few quickly then slow down
  for(let i=0;i<12;i++) setTimeout(spawnLetter,i*250);
  setInterval(spawnLetter,800);

  // SVG heart path drawing restart on load
  const heartPath = document.getElementById('heartPath');
  if(heartPath){
    const len = heartPath.getTotalLength();
    heartPath.style.strokeDasharray = len;
    heartPath.style.strokeDashoffset = len;
    // draw after a brief delay
    setTimeout(()=>{
      heartPath.style.transition = 'stroke-dashoffset 3s ease';
      heartPath.style.strokeDashoffset = '0';
    },700);
  }

  // countdown to next birthday (June 19)
  function updateCountdown(){
    const el = document.getElementById('countdown');
    if(!el) return;
    const now = new Date();
    const year = now.getMonth()>5 || (now.getMonth()===5 && now.getDate()>19) ? now.getFullYear()+1 : now.getFullYear();
    const target = new Date(year,5,19,0,0,0);
    const diff = target - now;
    if(diff<=0){ el.textContent = 'Happy Birthday!'; return; }
    const days = Math.floor(diff/86400000);
    const hrs = Math.floor((diff%86400000)/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    el.textContent = `${days}d ${hrs}h ${mins}m`;
  }
  updateCountdown();
  setInterval(updateCountdown,60000);

  // small confetti on page open (minimal, CSS friendly)
  function burstConfetti(){
    const c = document.querySelector('.confetti');
    if(!c) return;
    for(let i=0;i<30;i++){
      const dot = document.createElement('div');
      dot.style.position='absolute';
      dot.style.left = (10 + Math.random()*80)+'%';
      dot.style.top = (60 + Math.random()*30)+'%';
      dot.style.width = dot.style.height = (6+Math.random()*8)+'px';
      dot.style.background = Math.random()>0.5? 'var(--accent)':'#fff';
      dot.style.opacity = '0.9';
      dot.style.borderRadius='3px';
      dot.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
      dot.style.transition = `transform ${1+Math.random()*1.5}s ease, opacity 1.2s ease`;
      c.appendChild(dot);
      setTimeout(()=>{dot.style.transform = `translateY(-250px) rotate(${Math.random()*720}deg)`;dot.style.opacity='0';},20+i*20);
      setTimeout(()=>dot.remove(),2200+i*30);
    }
  }

  // initial confetti
  burstConfetti();

  // ensure memory video is muted so background music continues
  const memoryVideo = document.getElementById('memoryVideo');
  if(memoryVideo){
    try{ memoryVideo.muted = true; memoryVideo.playsInline = true; }catch(e){}
  }

  // video bubble: click to play/pause and hide bubble while playing
  const videoBubble = document.querySelector('.video-bubble');
  if (memoryVideo && videoBubble) {
    const setBubblePlaying = (playing) => {
      if (playing) videoBubble.classList.add('playing');
      else videoBubble.classList.remove('playing');
    };

    const toggleVideo = async () => {
      try {
        if (memoryVideo.paused) {
          await memoryVideo.play();
          setBubblePlaying(true);
        } else {
          memoryVideo.pause();
          setBubblePlaying(false);
        }
      } catch (e) {
        // play may be blocked until user gesture; ignore
      }
    };

    // bubble click toggles play
    videoBubble.addEventListener('click', (ev) => { ev.stopPropagation(); toggleVideo(); });

    // clicking the video itself also toggles play/pause
    memoryVideo.addEventListener('click', (ev) => { ev.stopPropagation(); toggleVideo(); });

    // reflect video state to bubble visibility
    memoryVideo.addEventListener('play', () => setBubblePlaying(true));
    memoryVideo.addEventListener('pause', () => setBubblePlaying(false));
    memoryVideo.addEventListener('ended', () => setBubblePlaying(false));
  }

});
const pageButtons = document.querySelectorAll('.page-btn');
const pages = document.querySelectorAll('.page');
const wishButton = document.getElementById('wishButton');
const musicButton = document.getElementById('musicButton');
const heartGlow = document.getElementById('heartGlow');
const countdown = document.getElementById('countdown');
const confettiContainer = document.querySelector('.confetti');

let audioCtx;
let musicInterval;
let isPlaying = false;
let melodyIndex = 0;
const melody = [262, 330, 392, 330, 262, 196, 174, 196];

pageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const pageNumber = button.dataset.page;
    pages.forEach((page) => page.classList.toggle('active', page.id === `page${pageNumber}`));
    pageButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
  });
});

wishButton.addEventListener('click', () => {
  heartGlow.classList.add('active');
  createHeartBurst(16);
  setTimeout(() => heartGlow.classList.remove('active'), 450);
});

musicButton.addEventListener('click', () => {
  if (isPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});

function playTone(frequency, duration = 0.35) {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.18;
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  oscillator.stop(audioCtx.currentTime + duration);
}

function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  musicInterval = setInterval(() => {
    playTone(melody[melodyIndex % melody.length]);
    melodyIndex += 1;
  }, 450);

  isPlaying = true;
  musicButton.textContent = 'Pause music';
}

function stopMusic() {
  clearInterval(musicInterval);
  isPlaying = false;
  musicButton.textContent = 'Play music';
}

function updateCountdown() {
  const birthday = new Date(2026, 5, 19, 0, 0, 0);
  const now = new Date();
  const diff = birthday - now;

  if (diff <= 0) {
    countdown.textContent = 'Happy 20th birthday! 🎂';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.textContent = `${days} days ${hours}h ${minutes}m ${seconds}s until your birthday`;
}

function createHeartBurst(count) {
  const container = document.createElement('div');
  container.className = 'heart-container';

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    const x = 50 + (Math.random() * 240 - 120);
    const y = 120 + Math.random() * 40;
    const scale = 0.8 + Math.random() * 0.8;
    const hue = 325 + Math.random() * 30;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.transform = `translate(-50%, 0) scale(${scale}) rotate(45deg)`;
    heart.style.background = `linear-gradient(135deg, hsl(${hue}, 95%, 65%), hsl(${hue}, 75%, 85%))`;
    heart.style.animationDuration = `${1.8 + Math.random() * 0.8}s`;
    container.appendChild(heart);
  }

  const interactiveCard = heartGlow.closest('.interactive-card');
  interactiveCard.appendChild(container);

  setTimeout(() => container.remove(), 2200);
}

function createConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti-piece';
  const size = Math.floor(Math.random() * 12) + 8;
  confetti.style.width = `${size}px`;
  confetti.style.height = `${size}px`;
  confetti.style.left = `${Math.random() * 100}%`;
  confetti.style.background = `hsl(${Math.random() * 360}, 90%, 75%)`;
  confetti.style.animationDuration = `${3 + Math.random() * 2.5}s`;
  confettiContainer.appendChild(confetti);

  setTimeout(() => confetti.remove(), 5200);
}

setInterval(createConfetti, 220);
setInterval(updateCountdown, 1000);
updateCountdown();

pages.forEach((page, index) => {
  page.classList.toggle('active', index === 0);
});
