const tracks = [
      {
        title: "Love For You (Slowed Down)",
        src: "/assets/music/loveforyou.mp3",
        cover: "/assets/images/music/loveforyouslowed.jpg"
      },
      {
        title: "Has To Be",
        src: "/assets/music/hastobe.mp3",
        cover: "/assets/images/music/ithastobe.jpg"
      },
      {
        title: "Talk Down",
        src: "/assets/music/talkdown.mp3",
        cover: "/assets/images/music/talkdown.jpg"
      },
      {
        title: "Dry Your Eyes",
        src: "/assets/music/dryyoureyes.mp3",
        cover: "/assets/images/music/dryyoureyes.jpg"
      }
    ];

    let currentTrack = 0;
    const audio = document.getElementById("audio");
    const title = document.getElementById("track-title");
    const cover = document.getElementById("cover");
    const playBtn = document.getElementById("play");

    function loadTrack(index) {
      audio.src = tracks[index].src;
      title.textContent = tracks[index].title;
      cover.src = tracks[index].cover;
    }

    function saveState() {
      localStorage.setItem("playerState", JSON.stringify({
        track: currentTrack,
        time: audio.currentTime,
        playing: !audio.paused
      }));
    }

    function restoreState() {
      const saved = JSON.parse(localStorage.getItem("playerState"));
      if (saved) {
        currentTrack = saved.track || 0;
        loadTrack(currentTrack);

        audio.addEventListener("loadedmetadata", () => {
          if (saved.time) {
            audio.currentTime = saved.time;
          }
          if (saved.playing) {
            audio.play().then(() => {
              playBtn.textContent = "⏸";
            }).catch(() => {
              playBtn.textContent = "▶";
            });
          }
        }, { once: true });
      } else {
        loadTrack(currentTrack);
      }
    }

    document.getElementById("prev").addEventListener("click", () => {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrack);
      audio.play();
      playBtn.textContent = "⏸";
      saveState();
    });

    document.getElementById("next").addEventListener("click", () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      loadTrack(currentTrack);
      audio.play();
      playBtn.textContent = "⏸";
      saveState();
    });

    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
      } else {
        audio.pause();
        playBtn.textContent = "▶";
      }
      saveState();
    });

    audio.addEventListener("timeupdate", saveState);
    audio.addEventListener("pause", saveState);
    audio.addEventListener("play", saveState);

    restoreState();

    