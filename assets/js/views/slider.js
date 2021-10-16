export class Slider {
  #element = {};
  #slideNum;
  #currentSlide = 0;
  constructor(options) {
    const { container, prev, next } = options;
    this.#element.container = document.querySelector(container);
    this.#element.prev = document.querySelector(prev);
    this.#element.next = document.querySelector(next);
  }

  init() {
    // Wrapper
    const container = this.#element.container;
    const clone = container.cloneNode(true);

    container.className = "slider";
    Object.assign(container.style, {
      overflow: "hidden",
    });
    clone.style = "transition: transform 0.3s linear";
    container.innerHTML = "";
    container.appendChild(clone);
    this.#slideNum = Math.ceil(
      container.firstChild.childElementCount / this.#getItemNumOfSlide()
    );

    // Check control
    this.#checkControl();
    this.#addEvent();
  }

  #hidePrev() {
    this.#element.prev.style = "font-size: 0";
  }

  #hideNext() {
    this.#element.next.style = "font-size: 0";
  }

  #displayPrev() {
    this.#element.prev.style = "font-size: ỉnherit";
  }

  #displayNext() {
    this.#element.next.style = "font-size: ỉnherit";
  }

  #checkControl() {
    this.#hidePrev();
    this.#hideNext();

    if (this.#currentSlide > 0) {
      this.#displayPrev();
    }

    if (this.#currentSlide < this.#slideNum - 1) {
      this.#displayNext();
    }
  }

  #getItemNumOfSlide() {
    const slider = document.querySelector(".slider");
    const sliderItem = this.#element.container.firstChild.children[0];
    return +(slider.clientWidth / sliderItem.clientWidth).toFixed(0);
  }

  #goToSlide(num) {
    this.#element.container.firstChild.style.transform = `translate(${
      -num * 100
    }%)`;
  }

  #addEvent() {
    this.#element.prev.addEventListener("click", () => {
      --this.#currentSlide;
      this.#goToSlide(this.#currentSlide);
      this.#checkControl();
    });

    this.#element.next.addEventListener("click", () => {
      ++this.#currentSlide;
      this.#goToSlide(this.#currentSlide);
      this.#checkControl();
    });
  }
}
