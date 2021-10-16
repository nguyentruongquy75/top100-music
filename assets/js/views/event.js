class Player {
  #element = {};
  #playlist = [];
  #isDisplay = false;
  #isPlaying = false;
  #isRepeat = false;
  #isRandom = false;
  #currentIndex = null;
  #history = [];
  #historyIndex = 0;
  init(options, playlist) {
    const {
      songInfo: { songImg, songName, songSinger },
      control: { random, backward, play, forward, repeat },
      progress: { track, lower, currentTime, songTime },
      audio,
      container,
    } = options;
    // Add element to Obj
    this.#element.container = document.querySelector(container);
    this.#element.songImg = document.querySelector(songImg);
    this.#element.songName = document.querySelector(songName);
    this.#element.songSinger = document.querySelector(songSinger);
    this.#element.random = document.querySelector(random);
    this.#element.backward = document.querySelector(backward);
    this.#element.play = document.querySelector(play);
    this.#element.forward = document.querySelector(forward);
    this.#element.repeat = document.querySelector(repeat);
    this.#element.track = document.querySelector(track);
    this.#element.lower = document.querySelector(lower);
    this.#element.currentTime = document.querySelector(currentTime);
    this.#element.songTime = document.querySelector(songTime);
    this.#element.audio = document.querySelector(audio);
    this.#addEvent();

    // Playlist
    this.#playlist = playlist;
  }

  render(song, index) {
    location.hash = `${index}`;
    if (!this.#isDisplay) {
      this.#element.container.classList.add("song-player--display");
    }
    // Current index
    this.#currentIndex = index;

    this.#element.audio.src = song.music;
    this.#element.songImg.src = song.avatar;
    this.#element.songName.textContent = song.title;
    this.#element.songSinger.textContent = song.creator;

    this.#element.audio.addEventListener("loadeddata", () => {
      this.#element.songTime.textContent = this.#calcTime(
        this.#element.audio.duration
      );
    });
  }

  #calcTime(songTime) {
    const minute = Math.trunc(songTime / 60);
    const seconds = Math.ceil(songTime % 60);
    return `${minute}:${seconds < 10 ? "0" + seconds : seconds}`;
  }

  playSong() {
    this.#isPlaying = true;
    const audio = this.#element.audio;
    audio.play();
    this.#element.play.classList.add("song-control__play--playing");
    this.#element.songImg.parentElement.classList.add("song-img--rotate");
    this.pauseAnimation(false);
  }

  pauseAnimation(bool) {
    bool
      ? (this.#element.songImg.parentElement.style.animationPlayState =
          "paused")
      : (this.#element.songImg.parentElement.style.animationPlayState = null);
  }

  #addEvent() {
    const audio = this.#element.audio;

    const pauseSong = () => {
      audio.pause();
      this.#element.play.classList.remove("song-control__play--playing");
      this.pauseAnimation(true);
    };

    const repeatSong = (bool) => {
      audio.loop = bool;
    };

    const nextSong = () => {
      if (this.#isRandom) {
        this.#historyIndex++;
        if (this.#historyIndex < this.#history.length) {
          this.render(
            this.#playlist[this.#history[this.#historyIndex]],
            this.#history[this.#historyIndex]
          );
        } else {
          const nextIndex = Math.floor(
            Math.random() * this.#playlist.length + 1
          );
          this.render(this.#playlist[nextIndex], nextIndex);
          this.#history.push(nextIndex);
        }
      } else {
        this.#currentIndex =
          this.#currentIndex + 1 > this.#playlist.length - 1
            ? this.#playlist - 1
            : this.#currentIndex + 1;
        this.render(this.#playlist[this.#currentIndex], this.#currentIndex);
      }
    };

    const prevSong = () => {
      if (this.#isRandom) {
        this.#historyIndex =
          this.#historyIndex - 1 < 0 ? 0 : this.#historyIndex - 1;
        this.render(
          this.#playlist[this.#history[this.#historyIndex]],
          this.#history[this.#historyIndex]
        );
      } else {
        const index = --this.#currentIndex;
        if (index < 0) {
          this.#currentIndex = 0;
        }
        this.render(this.#playlist[this.#currentIndex], this.#currentIndex);
      }
    };

    //  Play / pause
    this.#element.play.addEventListener("click", () => {
      this.#isPlaying = !this.#isPlaying;
      if (this.#isPlaying) {
        this.playSong();
      } else {
        pauseSong();
      }
    });

    // Backward
    this.#element.backward.addEventListener("click", () => {
      prevSong();
      if (this.#isPlaying) {
        this.playSong();
      }
    });

    // Forward
    this.#element.forward.addEventListener("click", () => {
      nextSong();
      if (this.#isPlaying) {
        this.playSong();
      }
    });

    // Repeat
    this.#element.repeat.addEventListener("click", () => {
      this.#isRepeat = !this.#isRepeat;
      if (this.#isRepeat) {
        this.#element.repeat.classList.add("song-control__repeat--active");
        repeatSong(this.#isRepeat);
      } else {
        this.#element.repeat.classList.remove("song-control__repeat--active");
        repeatSong(this.#isRepeat);
      }
    });

    // Random
    this.#element.random.addEventListener("click", () => {
      this.#isRandom = !this.#isRandom;
      this.#history.push(this.#currentIndex);
      if (this.#isRandom) {
        this.#element.random.classList.add("song-control__random--active");
      } else {
        this.#element.random.classList.remove("song-control__random--active");
      }
    });

    // Seeking
    this.#element.track.addEventListener("click", (e) => {
      const { left, width } = e.target.getBoundingClientRect();
      const clientX = e.clientX;
      const percent = ((clientX - left) * 100) / width;

      // update lower
      this.#element.lower.style.width = `${percent}%`;
      //update song time
      this.#element.audio.currentTime =
        (percent / 100) * this.#element.audio.duration;
    });

    // Real Time song
    audio.addEventListener("timeupdate", () => {
      const percent = (audio.currentTime * 100) / audio.duration;
      this.#element.currentTime.textContent = this.#calcTime(audio.currentTime);
      this.#element.lower.style.width = `${percent}%`;
    });

    //End
    audio.addEventListener("ended", () => {
      this.#element.play.classList.remove("song-control__play--playing");
      nextSong();
      this.playSong();
    });

    // Load start
    audio.addEventListener("loadstart", () => {
      this.#element.play.classList.add("song-control__play--loading");
      this.#element.play.classList.remove("song-control__play--error");
    });

    // Load end
    audio.addEventListener("loadedmetadata", () => {
      this.#element.play.classList.remove("song-control__play--loading");
    });

    audio.addEventListener("error", () => {
      this.#element.play.classList.remove("song-control__play--loading");
      this.#element.play.classList.add("song-control__play--error");
    });
  }
}

export const player = new Player();

const searchInput = document.querySelector(".header__search-input");

searchInput.addEventListener("focusin", function () {
  const headerSearch = document.querySelector(".header__search");

  headerSearch.classList.add("header__search--searching");
});

searchInput.addEventListener("focusout", function () {
  const headerSearch = document.querySelector(".header__search");

  headerSearch.classList.remove("header__search--searching");
});

const searchResultList = document.querySelector(".header__search-result__list");

searchResultList.addEventListener("mousedown", (e) => {
  e.preventDefault();
});
