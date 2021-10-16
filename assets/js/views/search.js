import image from "../../img/top100.jpg";

export class Search {
  #element = {};
  #data = [];
  constructor(options, data) {
    const { searchInput, searchResult, searchResultItem, searchMessage } =
      options;

    this.#element.searchInput = document.querySelector(searchInput);
    this.#element.searchResult = document.querySelector(searchResult);
    this.#element.searchResultItem = document.querySelector(searchResultItem);
    this.#element.searchMessage = document.querySelector(searchMessage);

    this.#data = data;
    this.#addEvent();
  }

  #getResult(search, length) {
    // Tolowercae
    // trim

    const result = this.#data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase().trim())
    );
    return result.slice(0, length);
  }

  #renderMessage(message) {
    this.#element.searchMessage.textContent = message;
  }

  #renderResult(dataArr) {
    const searchResult = this.#element.searchResult;
    // Clear search result
    searchResult.innerHTML = "";
    // Message
    dataArr.length > 0
      ? this.#renderMessage("")
      : this.#renderMessage("Không có kết quả");
    dataArr.forEach((item) =>
      searchResult.insertAdjacentHTML(
        "beforeend",
        `<li class="header__search-result__item">
        <a href="detail.html?category=${item.category}&playlistIndex=${item.index}" class="header__search-result__item-link">
          <div class="header__search-result__item-img">
            <img src="${image}" alt="Image" />
          </div>
          <div class="header__search-result__item-info">
            <span class="header__search-result__item-name"
              >${item.name}</span
            >
            <span class="header__search-result__item-singer"
              >Playlist</span
            >
          </div>
        </a>
      </li>`
      )
    );
  }

  #addEvent() {
    const searchInput = this.#element.searchInput;
    searchInput.addEventListener("keyup", () => {
      this.#renderResult(this.#getResult(searchInput.value, 5));
    });
  }
}
