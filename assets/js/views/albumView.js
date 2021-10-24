import image from "../../img/top100.jpg";

class AlbumView {
  render(targetSelector, dataObj, callback) {
    const targetElement = document.querySelector(targetSelector);
    const category = dataObj?.category;
    const htmls = dataObj.songs.map((value, index) =>
      callback(category, value, index)
    );
    targetElement.innerHTML = "";
    htmls.forEach((html) => {
      targetElement.insertAdjacentHTML("beforeend", html);
    });
  }

  #renderOffset(targetSelector, dataObj, callback, page, length) {
    const targetElement = document.querySelector(targetSelector);
    const category = dataObj?.category;
    const songs = dataObj.songs.slice(page * length, page * length + length);
    const htmls = songs.map((value, index) =>
      callback(category, value, index + page * length)
    );
    htmls.forEach((html) => {
      targetElement.insertAdjacentHTML("beforeend", html);
    });
  }

  renderAlbums(targetSelector, dataArr = {}) {
    this.render(targetSelector, dataArr, (category, value, index) => {
      return `
          <div class="playlist-section__item">
          <a href="detail.html?category=${category}&playlistIndex=${index}" class="playlist-section__item">
            <div class="playlist-section__item-img">
            <img src="${image}" alt="" />
              <div class="playlist-section__item-img-icon">
                <i class="far fa-play-circle"></i>
              </div>
            </div>
            <h5 class="playlist-section__item-name">
              Top 100 Bài Hát ${value.name} Hay Nhất
            </h5>
          </a>
        </div>
          `;
    });
  }

  renderDetail(data, page, length) {
    const playlistName = document.querySelectorAll(".playlist-desc__name");
    playlistName.forEach((value) => {
      value.textContent = data.name.includes("Top")
        ? data.name
        : `Top 100 ${data.name} hay nhất`;
    });
    this.#renderOffset(
      ".song__list",
      data,
      (_, value, index) => {
        return `
        <li class="song__item" data-index ="${index}">
         <audio src="${value.music}" hidden></audio>
        <div class="song__item-left">
          <div class="song__item-icon">
            <i class="fas fa-music"></i>          
          </div>

          <div class="song__item-img">
            <img
              src="${value.avatar}"
              alt=""
            />
            <div class="song__item-img-icon">
              <i class="fas fa-play"></i>
            </div>
          </div>

          <div class="song__item-info">
            <h5 class="song__item-name">
              ${value.title}
            </h5>
            <span class="song__item-singer"
              >${value.creator}</span
            >
          </div>
        </div>

        <span class="song__item-time"></span>
      </li>
        
        `;
      },
      page,
      length
    );
    const songItems = document.querySelectorAll(".song__item");
    songItems.forEach((item) => {
      this.#renderSongTime(item);
    });
  }

  #renderSongTime(item) {
    const audio = item.querySelector("audio");

    audio.addEventListener("loadeddata", () => {
      const songTime = audio.duration;
      const minute = Math.trunc(songTime / 60);
      const seconds = Math.floor(songTime % 60);

      item.querySelector(".song__item-time").textContent = `${minute} : ${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    });

    audio.addEventListener("error", () => {
      item.classList.add("song__item--error");
      item.querySelector(".song__item-time").innerHTML = ` <div class="error">
          <i class="fas fa-exclamation"></i>
        </div>`;
    });
  }
}

export const view = new AlbumView();
