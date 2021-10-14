class Model {
  #songs;
  #AM = {
    category: "AM",
  };
  #CA = {
    category: "CA",
  };
  #VN = {
    category: "VN",
  };
  #KL = {
    category: "KL",
  };

  async getData(api) {
    const response = await fetch(api);
    const { songs } = await response.json();
    const { top100_AM, top100_CA, top100_KL, top100_VN } = songs;
    this.#songs = songs;
    this.#AM.songs = top100_AM;
    this.#CA.songs = top100_CA;
    this.#KL.songs = top100_KL;
    this.#VN.songs = top100_VN;
  }

  getAllSong() {
    return this.#songs;
  }

  getAM() {
    return this.#AM;
  }

  getCA() {
    return this.#CA;
  }

  getKL() {
    return this.#KL;
  }

  getVN() {
    return this.#VN;
  }
}

export const model = new Model();
