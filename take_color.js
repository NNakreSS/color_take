class TakeColor {
  #canvas = document.createElement("canvas");
  #ctx = this.#canvas.getContext("2d");
  #colorDensisty = {};

  async mainColor(img) {
    const colors = await this.#getColors(img);
    return colors[0];
  }

  async colorPalette(img, colorCount = 4) {
    const colors = Array.from(new Set(await this.#getColors(img)));
    const colorPalette = [];
    for (let i = 0; i < colorCount; i++) {
      colorPalette.push(colors[i]);
    }
    return colorPalette;
  }

  async #getColors(img) {
    this.#canvas.width = img.width;
    this.#canvas.height = img.height;
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#ctx.drawImage(img, 0, 0, this.#canvas.width, this.#canvas.height);
    const imgData = this.#ctx.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    ).data;
    const imgColorData = await this.#extractColors(imgData);
    return imgColorData.sort(
      (a, b) => this.#colorDensisty[b] - this.#colorDensisty[a]
    );
  }

  async #extractColors(imgData) {
    const colors = [];
    imgData.forEach((_v, _i) => {
      const i = _i * 4;
      if (
        imgData[i + 3] > 0 &&
        imgData[i] != undefined &&
        imgData[i + 1] != undefined &&
        imgData[i + 2] != undefined
      ) {
        const color = `rgba(
          ${imgData[i]},${imgData[i + 1]},${imgData[i + 2]},${imgData[i + 3]}
          )`;
        this.#colorDensisty[color] = (this.#colorDensisty[color] || 0) + 1;
        colors.push(color);
      }
    });
    return colors;
  }
}
