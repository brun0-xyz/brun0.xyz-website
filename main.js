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

  let audioContext, analyser, source, dataArray;

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

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    animate();
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
