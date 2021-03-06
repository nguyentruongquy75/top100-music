import { api } from "./config";
import { view } from "./views/albumView";
import { player } from "./views/event";
import { model } from "./model";
import { Slider } from "./views/slider";
import { Search } from "./views/search";
model.getData(api).then(() => {
  const path = location.pathname;
  if (path === "/" || path.includes("index.html")) {
    view.renderAlbums(".playlist--AM .playlist-section__list", model.getAM());
    view.renderAlbums(".playlist--CA .playlist-section__list", model.getCA());
    view.renderAlbums(".playlist--KL .playlist-section__list", model.getKL());
    view.renderAlbums(".playlist--VN .playlist-section__list", model.getVN());

    //Init sldier
    new Slider({
      container: ".playlist--VN .playlist-section__list",
      prev: ".playlist--VN .slider-control__prev",
      next: ".playlist--VN .slider-control__next",
    }).init();

    new Slider({
      container: ".playlist--CA .playlist-section__list",
      prev: ".playlist--CA .slider-control__prev",
      next: ".playlist--CA .slider-control__next",
    }).init();

    new Slider({
      container: ".playlist--AM .playlist-section__list",
      prev: ".playlist--AM .slider-control__prev",
      next: ".playlist--AM .slider-control__next",
    }).init();

    new Slider({
      container: ".playlist--KL .playlist-section__list",
      prev: ".playlist--KL .slider-control__prev",
      next: ".playlist--KL .slider-control__next",
    }).init();
  } else if (path.includes("detail.html")) {
    const search = location.search;
    const category = search.slice(search.indexOf("=") + 1, search.indexOf("&"));
    const playlistIndex = search.slice(search.lastIndexOf("=") + 1);
    const randomBtn = document.querySelector(".random-btn");
    let songs = null;
    switch (category) {
      case "AM":
        songs = model.getAM().songs;
        break;
      case "CA":
        songs = model.getCA().songs;
        break;
      case "KL":
        songs = model.getKL().songs;
        break;
      case "VN":
        songs = model.getVN().songs;
        break;
    }

    randomBtn.addEventListener("click", () => {
      const song = songs[playlistIndex].songs[0];
      const playlistImg = document.querySelector(".playlist-img img");
      playlistImg.src = song.avatar;
      player.render(song, 0);
      player.playSong();
    });

    // Load
    const length = 10;
    let currentPage = 0;
    const totalPage = Math.ceil(songs[playlistIndex].songs.length / length) - 1;
    const songList = document.querySelector(".song__list");
    songList.innerHTML = "";
    view.renderDetail(songs[playlistIndex], currentPage, length);
    const songItems = document.querySelectorAll(".song__item");

    let lastSongItem = songList.lastElementChild;

    //optimize load

    const observe = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentPage++;
            if (currentPage > totalPage) {
              observe.observe(lastSongItem);
            } else {
              view.renderDetail(songs[playlistIndex], currentPage, length);
              observe.unobserve(lastSongItem);
              lastSongItem = songList.lastElementChild;
              observe.observe(lastSongItem);
            }
          }
        });
      },
      {
        threshold: 0.8,
      }
    );

    observe.observe(lastSongItem);

    // Init player
    player.init(
      {
        container: ".song-player",
        songInfo: {
          songImg: ".song-img img",
          songName: ".song-name",
          songSinger: ".song-singer",
        },
        control: {
          random: ".song-control__random",
          backward: ".song-control__backward",
          play: ".song-control__play",
          forward: ".song-control__forward",
          repeat: ".song-control__repeat",
        },
        progress: {
          track: ".song-control__progress__track",
          lower: ".song-control__progress__lower",
          currentTime: ".song-control__current-time",
          songTime: ".song-control__song-time",
        },
        audio: ".song-player audio",
      },
      songs[playlistIndex].songs
    );

    // Click on song Item
    songList.addEventListener("click", (e) => {
      const songItem = e.target.closest(".song__item");
      const index = songItem.dataset.index;
      const playlistImg = document.querySelector(".playlist-img img");

      // Change playlist image
      const song = songs[playlistIndex].songs[index];
      playlistImg.src = song.avatar;
      player.render(song, index);
      player.playSong();
    });

    // songItems.forEach((item) => {
    //   item.addEventListener("click", function () {
    //     const index = +this.dataset.index;
    //     const playlistImg = document.querySelector(".playlist-img img");

    //     // Change playlist image
    //     const song = songs[playlistIndex].songs[index];
    //     playlistImg.src = song.avatar;
    //     player.render(song, index);
    //     player.playSong();
    //   });
    // });

    document.querySelector(".playlist-img").addEventListener("click", () => {
      if (!location.hash.slice(1)) {
        player.render(songs[0]);
      }
      player.playSong();
    });
  }

  const dataSearch = [];

  Object.entries(model.getAllSong()).forEach(([key, value]) => {
    const data = value.map((item, index) => {
      item.name = `Top 100 B??i h??t ${item.name} hay nh???t`;
      item.category = key.slice(key.indexOf("_") + 1);
      item.index = index;
      return item;
    });
    dataSearch.push(...data);
  });
  new Search(
    {
      searchInput: ".header__search-input-container input",
      searchResult: ".header__search-result__list",
      searchResultItem: ".header__search-result__item",
      searchMessage: ".header__search-result__message",
    },
    dataSearch
  );
});
//Change hash

window.addEventListener("hashchange", () => {
  const songItemActive = document.querySelector(".song__item--active");
  const songIndex = location.hash.slice(1);
  const songItem = document.querySelector(
    `.song__item[data-index='${songIndex}']`
  );
  songItemActive?.classList.remove("song__item--active");
  songItem?.classList.add("song__item--active");
});
