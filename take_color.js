class TakeColor {
  #canvas = document.createElement("canvas");
  #ctx = this.#canvas.getContext("2d");
  #colorDensisty = {};

  async mainColor(img) {
    const palette = await this.colorPalette(img, 2).then((color) => color);
    return palette[0];
  }

  async colorPalette(img, colorCount = 6) {
    let colors = this.#getUniqueColors(await this.#getColors(img));
    const cmap = await quantize(colors, colorCount);
    const palette = cmap ? cmap.palette() : null;
    return palette;
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
    const sortedColorsData = imgColorData.sort(
      (a, b) =>
        this.#colorDensisty[b.join(",")] - this.#colorDensisty[a.join(",")]
    );
    return sortedColorsData;
  }

  async #extractColors(imgData) {
    const colors = [];
    for (let i = 0; i < imgData.length; i += 10) {
      const offset = i * 4;
      const r = imgData[offset],
        g = imgData[offset + 1],
        b = imgData[offset + 2],
        a = imgData[offset + 3];
      if ((typeof a === "undefined" || a >= 125) && typeof b !== "undefined") {
        this.#colorDensisty[`${r},${g},${b}`] =
          (this.#colorDensisty[`${r},${g},${b}`] || 0) + 1;
        colors.push([r, g, b]);
      }
    }
    return colors;
  }

  #getUniqueColors(colors) {
    const uniqueColorsSet = new Set(colors.map((color) => color.toString()));
    const uniqueColors = Array.from(uniqueColorsSet, (colorStr) =>
      colorStr.split(",").map(Number)
    );
    return uniqueColors;
  }
}
