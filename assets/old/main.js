particlesJS('particles-js', {
  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.5,
      "random": true
    },
    "size": {
      "value": 3,
      "random": true
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "enable": true,
      "speed": 1.6,
      "direction": "bottom-left",   
      "random": true,              
      "straight": false,         
      "out_mode": "out",
      "bounce": false
    }
  },
  "interactivity": {
    "events": {
      "onhover": { "enable": false },
      "onclick": { "enable": false },
      "resize": true
    }
  },
  "retina_detect": true
});

const splash = document.getElementById('splash');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('audio');
const visual = document.getElementById('visual');
const toggleBtn = document.getElementById('toggle-btn');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.getElementById('progress-bar');

let audioContext, analyser, source, dataArray;
let playlist = [
  '/assets/music/loveforyou.mp3',
  '/assets/music/imsofucked.mp3',
  '/assets/music/lucky.mp3',
  '/assets/music/primecookie.mp3',
  '/assets/music/posterboy.mp3',
  '/assets/music/myordinarylife.mp3',
  '/assets/music/myheart.mp3'
  
];
let currentTrackIndex = parseInt(localStorage.getItem('currentTrackIndex')) || 0;

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
  const wasPaused = localStorage.getItem('paused') === 'true';

  if (savedVolume) audio.volume = savedVolume;
  volumeSlider.value = audio.volume;

  if (savedTime) audio.currentTime = savedTime;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  source = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  animate();

  if (wasPaused) {
    audio.pause();
    toggleBtn.textContent = 'Play';
  } else {
    audio.play();
    toggleBtn.textContent = 'Pause';
  }
}

toggleBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    toggleBtn.textContent = 'Pause';
    localStorage.setItem('paused', 'false');
  } else {
    audio.pause();
    toggleBtn.textContent = 'Play';
    localStorage.setItem('paused', 'true');
  }
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  localStorage.setItem('volume', audio.volume);
});

audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;
  localStorage.setItem('currentTime', audio.currentTime);
});

progressBar.addEventListener('input', () => {
  const newTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = newTime;
});

audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  localStorage.setItem('currentTrackIndex', currentTrackIndex);
  audio.src = playlist[currentTrackIndex];
  audio.play();
  localStorage.setItem('paused', 'false');
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

const menu = document.getElementById('customMenu');

  // Show custom menu on left click
  document.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default selection or actions
    menu.style.top = e.clientY + 'px';
    menu.style.left = e.clientX + 'px';
    menu.style.display = 'block';
  });

  // Hide the menu if you click elsewhere
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });

  // Optional: hide menu on scroll
  window.addEventListener('scroll', () => {
    menu.style.display = 'none';
  });
