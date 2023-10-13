window.onload = () => {
  const img = document.createElement("img");
  img.src = "./ps.png";
  img.onload = () => {
    const colorTake = new TakeColor();
    colorTake.mainColor(img).then((result) => {
      const colorDıv = document.getElementById("dominantColorBox");
      colorDıv.style.background = result;
      colorDıv.style.filter = `drop-shadow(0 0 5px ${result})`;
      document.getElementById("dominantColorRgba").innerHTML = result;
    });

    colorTake.colorPalette(img, 6, 10).then((result) => {
      result = result.map((c) => `rgba(${c[0]} , ${c[1]} , ${c[2]})`);
      console.log(result);
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
