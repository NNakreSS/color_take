window.onload = () => {
  const img = document.createElement("img");
  img.src = "./ps.png";
  img.onload = () => {
    const colorTake = new TakeColor();
    colorTake.mainColor(img).then((result) => {
      const colorDıv = document.getElementById("dominantColorBox");
      colorDıv.style.background = `rgba(${result[0]} , ${result[1]} , ${result[2]})`;
      colorDıv.style.filter = `drop-shadow(0 0 5px rgba(${result[0]} , ${result[1]} , ${result[2]}))`;
      document.getElementById("dominantColorRgba").innerHTML = result;
    });

    colorTake.colorPalette(img, 6, 10).then((result) => {
      result = result.map((c) => `rgba(${c[0]} , ${c[1]} , ${c[2]})`);
      createPalette(result);
    });
  };
};

function createPalette(colors) {
  const colorContainer = document.getElementById("colors");
  for (let index = 0; index < 6; index++) {
    const element = colors[index];
    const colorDiv = document.createElement("div");
    colorDiv.className = "colorItem";
    colorDiv.style.background = element;
    colorContainer.appendChild(colorDiv);
  }
}
