particlesJS('particles-js', {
  "particles": {
    "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#ffffff" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5 },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": false },
    "move": { "enable": true, "speed": 2 }
  },
  "interactivity": {
    "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
    "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } }
  },
  "retina_detect": true
});

const splash = document.getElementById('splash');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('audio');
const visual = document.getElementById('visual');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.getElementById('progress-bar');

const playlist = [
  '/loveforyou.mp3',
  '/anothersong.mp3' // Add more paths if needed
];
let currentTrackIndex = 0;

let audioContext, analyser, source, dataArray;

splash.addEventListener('click', () => {
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.classList.add('fade-in');
    initAudio();
  }, 1000);
});

function initAudio() {
  audio.src = playlist[currentTrackIndex];
  audio.load();

  const savedVolume = localStorage.getItem('volume');
  const savedTime = localStorage.getItem('currentTime');
  const savedPaused = localStorage.getItem('paused');

  if (savedVolume) audio.volume = savedVolume;
  volumeSlider.value = audio.volume;

  if (savedTime) audio.currentTime = savedTime;

  if (savedPaused === 'false') {
    audio.play();
  }

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  source = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  animate();
}

playBtn.addEventListener('click', () => {
  audio.play();
  localStorage.setItem('paused', 'false');
});
pauseBtn.addEventListener('click', () => {
  audio.pause();
  localStorage.setItem('paused', 'true');
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  localStorage.setItem('volume', audio.volume);
});

audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;
  localStorage.setItem('currentTime', audio.currentTime);
});

progressBar.addEventListener('input', () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
  localStorage.setItem('currentTime', seekTime);
});

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const avg = sum / dataArray.length;
  const scale = 1 + avg / 300;
  const shadow = 30 + avg / 2;

  visual.style.transform = `scale(${scale})`;
  visual.style.boxShadow = `0 0 ${shadow}px rgba(255,255,255,0.8)`;
}
