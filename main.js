particlesJS('particles-js', {
  "particles": {
    "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#ffffff" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": false },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": false },
    "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
    "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } }
  },
  "retina_detect": true
});

const splash = document.getElementById('splash');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('audio');
const visual = document.getElementById('visual');

const playPauseBtn = document.createElement('button');
playPauseBtn.id = 'playPauseBtn';
playPauseBtn.textContent = '⏸️';
playPauseBtn.style.position = 'fixed';
playPauseBtn.style.bottom = '20px';
playPauseBtn.style.left = '20px';
playPauseBtn.style.zIndex = '11';
document.body.appendChild(playPauseBtn);

const volumeSlider = document.createElement('input');
volumeSlider.type = 'range';
volumeSlider.id = 'volumeSlider';
volumeSlider.min = 0;
volumeSlider.max = 1;
volumeSlider.step = 0.01;
volumeSlider.style.position = 'fixed';
volumeSlider.style.bottom = '20px';
volumeSlider.style.left = '60px';
volumeSlider.style.zIndex = '11';
document.body.appendChild(volumeSlider);

const progressBar = document.createElement('input');
progressBar.type = 'range';
progressBar.id = 'progressBar';
progressBar.min = 0;
progressBar.max = 100;
progressBar.step = 0.1;
progressBar.style.position = 'fixed';
progressBar.style.bottom = '50px';
progressBar.style.left = '20px';
progressBar.style.width = '200px';
progressBar.style.zIndex = '11';
document.body.appendChild(progressBar);

audio.volume = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')) : 1;
volumeSlider.value = audio.volume;

audio.currentTime = localStorage.getItem('currentTime') ? parseFloat(localStorage.getItem('currentTime')) : 0;

let isPlaying = true;

const playlist = ['/loveforyou.mp3', '/song2.mp3', '/song3.mp3'];
let currentSongIndex = localStorage.getItem('currentSongIndex') ? parseInt(localStorage.getItem('currentSongIndex')) : 0;
audio.src = playlist[currentSongIndex];
audio.play();

splash.addEventListener('click', () => {
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.classList.add('fade-in');
    startAudio();
  }, 1000);
});

function startAudio() {
  audio.play();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audio);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

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
  animate();
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸️';
    isPlaying = true;
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶️';
    isPlaying = false;
  }
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  localStorage.setItem('volume', audio.volume);
});

audio.addEventListener('timeupdate', () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100;
  localStorage.setItem('currentTime', audio.currentTime);
});

progressBar.addEventListener('input', () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('currentTime', audio.currentTime);
  localStorage.setItem('currentSongIndex', currentSongIndex);
});

audio.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  localStorage.setItem('currentSongIndex', currentSongIndex);
  audio.src = playlist[currentSongIndex];
  audio.play();
});
