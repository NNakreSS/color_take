class TakeColor {
  #canvas = document.createElement("canvas");
  #ctx = this.#canvas.getContext("2d");
  #colorDensisty = {};

  async mainColor(img) {
    const colors = await this.#getColors(img);
    return colors[0];
  }

  async colorPalette(img, colorCount = 4, quality = 5) {
    // const colors = Array.from(new Set(await this.#getColors(img, quality)));
    let colors = this.#getUniqueColors(await this.#getColors(img, quality));
    // colors = this.#mergeSimilarColors(colors,90);
    const cmap = MMCQ.quantize(colors, colorCount);
    const palette = cmap ? cmap.palette() : null;
    return palette;
  }

  async #getColors(img, quality) {
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
    const imgColorData = await this.#extractColors(imgData, quality);
    const sortedColorsData = imgColorData.sort(
      (a, b) =>
        this.#colorDensisty[b.join(",")] - this.#colorDensisty[a.join(",")]
    );
    return sortedColorsData;
  }

  async #extractColors(imgData, quality) {
    const colors = [];
    // imgData.forEach((_v, _i) => {
    //   _i *= 4;
    //   const offset = _i * quality;
    //   const r = imgData[offset],
    //     g = imgData[offset + 1],
    //     b = imgData[offset + 2],
    //     a = imgData[offset + 3];
    //   if (
    //     imgData[offset + 3] > 0 &&
    //     imgData[offset] != undefined &&
    //     imgData[offset + 1] != undefined &&
    //     imgData[offset + 2] != undefined
    //   ) {
    //     const color = [r, g, b, a];
    //     this.#colorDensisty[`${r},${g},${b},${a}`] =
    //       (this.#colorDensisty[`${r},${g},${b},${a}`] || 0) + 1;
    //     colors.push(color);
    //   }
    // });
    for (let i = 0; i < imgData.length; i += quality) {
      const offset = i * 4;
      const r = imgData[offset],
        g = imgData[offset + 1],
        b = imgData[offset + 2],
        a = imgData[offset + 3];
      if ((typeof a === "undefined" || a >= 125) && typeof b !== "undefined") {
        // this.#colorDensisty[`${r},${g},${b},${a}`] =
        this.#colorDensisty[`${r},${g},${b}`] =
          // (this.#colorDensisty[`${r},${g},${b},${a}`] || 0) + 1;
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

  #mergeSimilarColors(colors, threshold = 20) {
    if (threshold < 20) threshold = 20;
    const mergedColors = [];
    for (let i = 0; i < colors.length; i++) {
      let currentColor = colors[i];
      let shouldMerge = false;
      for (let j = 0; j < mergedColors.length; j++) {
        let mergedColor = mergedColors[j];
        const colorDifference = Math.sqrt(
          Math.pow(currentColor[0] - mergedColor[0], 2) +
            Math.pow(currentColor[1] - mergedColor[1], 2) +
            Math.pow(currentColor[2] - mergedColor[2], 2)
          // Math.pow(currentColor[3] - mergedColor[3], 2)
        );
        if (colorDifference < threshold) {
          shouldMerge = true;
          mergedColors[j] = [
            Math.round((currentColor[0] + mergedColor[0]) / 2),
            Math.round((currentColor[1] + mergedColor[1]) / 2),
            Math.round((currentColor[2] + mergedColor[2]) / 2),
            // Math.round((currentColor[3] + mergedColor[3]) / 2),
          ];
          break;
        }
      }
      if (!shouldMerge) {
        mergedColors.push(currentColor);
      }
    }
    return mergedColors;
  }
}
