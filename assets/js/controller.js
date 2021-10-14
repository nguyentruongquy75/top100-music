import { api } from "./config";
import { view } from "./views/albumView";
import { player } from "./views/event";
import { model } from "./model";

model.getData(api).then(() => {
  const path = location.pathname;
  if (path === "/" || path.includes("index.html")) {
    view.renderAlbums(".playlist--AM .playlist-section__list", model.getAM());
    view.renderAlbums(".playlist--CA .playlist-section__list", model.getCA());
    view.renderAlbums(".playlist--KL .playlist-section__list", model.getKL());
    view.renderAlbums(".playlist--VN .playlist-section__list", model.getVN());
  } else if (path.includes("detail.html")) {
    const search = location.search;
    const category = search.slice(search.indexOf("=") + 1, search.indexOf("&"));
    const playlistIndex = search.slice(search.lastIndexOf("=") + 1);
    console.log(playlistIndex);
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

    view.renderDetail(songs[playlistIndex]);
    const songItems = document.querySelectorAll(".song__item");

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

    songItems.forEach((item) => {
      item.addEventListener("click", function () {
        const index = +this.dataset.index;
        const playlistImg = document.querySelector(".playlist-img img");

        // Change playlist image
        const song = songs[playlistIndex].songs[index];
        playlistImg.src = song.avatar;
        player.render(song, index);
      });
    });

    document.querySelector(".playlist-img").addEventListener("click", () => {
      if (!location.hash.slice(1)) {
        player.render(songs[0]);
      }
      player.playSong();
    });
  }
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
