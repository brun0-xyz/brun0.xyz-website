particlesJS('particles-js', {
  "particles": {
    "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#ffffff" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": false },
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
const playPauseBtn = document.getElementById('play-pause');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.getElementById('progress-bar');

let audioContext, analyser, source, dataArray;
let playlist = ["/loveforyou.mp3", "/primecookie.mp3", "/myordinarylife.mp3"]; 
let currentSongIndex = 0;

function loadSong(index) {
  audio.src = playlist[index];
}

splash.addEventListener('click', () => {
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.classList.add('fade-in');
    startAudio();
  }, 1000);
});

function startAudio() {
  loadSong(currentSongIndex);

  audio.volume = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')) : 0.5;
  volumeSlider.value = audio.volume;

  const lastTime = localStorage.getItem('currentTime');
  if (lastTime) {
    audio.currentTime = parseFloat(lastTime);
  }

  audio.play();

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  source = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  animate();
  updateProgress();
}

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

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = 'Pause';
  } else {
    audio.pause();
    playPauseBtn.textContent = 'Play';
  }
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
  const time = (progressBar.value / 100) * audio.duration;
  audio.currentTime = time;
});

audio.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  audio.play();
  playPauseBtn.textContent = 'Pause';
});

function updateProgress() {
  requestAnimationFrame(updateProgress);
  if (!audio.paused) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress || 0;
  }
}
