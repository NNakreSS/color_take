const colorTake = new TakeColor();
const eyeDropper = new EyeDropper();
const selectUrlButton = document.querySelector("#selectUrlButton");
const image = document.querySelector("img");
const pickedColor = document.querySelector("#pickColor");
const startColorPicker = document.querySelector("#startColorPicker");
const imgButton = document.querySelector("#imgButton");
const dominantColorBox = document.getElementById("dominantColorBox");
const dominantColorRgba = document.getElementById("dominantColorRgba");

selectImage();

function selectImage(url) {
  const img = document.querySelector("img");
  img.crossOrigin = "anonymous";
  img.src = url || "./ps.png";

  img.onload = () => {
    colorTake.colorPalette(img).then((result) => {
      createPalette(result);
    });

    colorTake.mainColor(img).then((result) => {
      const color = `rgb(${result[0]} , ${result[1]} , ${result[2]})`;
      dominantColorRgba.dataset.color = dominantColorBox.style.background =
        color;
      dominantColorBox.style.filter = `drop-shadow(0 0 20px ${color}`;
      dominantColorRgba.innerHTML = color;
    });
  };
}

function createPalette(result) {
  const colorContainer = document.getElementById("colors");
  colorContainer.innerHTML = "";
  const colors = result.map((c) => `rgb(${c[0]} , ${c[1]} , ${c[2]})`);
  for (let index = 0; index < colors.length; index++) {
    const element = colors[index];
    const colorDiv = document.createElement("div");
    colorDiv.className = "colorItem";
    colorDiv.style.background = element;
    colorDiv.dataset.color = element;
    colorDiv.innerHTML = '<i class="copy-icon fa-solid fa-copy"></i>';

    let colorIcon;
    isDarkColor(result[index]) ? (colorIcon = "white") : (colorIcon = "black");
    colorDiv.style.color = colorIcon;

    colorContainer.appendChild(colorDiv);

    colorDiv.addEventListener("click", () => {
      copyText(colorDiv.dataset.color);
    });
  }
}

function copyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function isDarkColor(rgbValues) {
  const [red, green, blue] = rgbValues;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance < 128;
}

function showColorPicker() {
  if (window.EyeDropper) {
    eyeDropper
      .open()
      .then((res) => {
        pickedColor.style.filter = `drop-shadow(0 0 10px ${res.sRGBHex})`;
        pickedColor.style.backgroundColor = res.sRGBHex;
        document.querySelector(
          "#selectColor"
        ).style.boxShadow = `inset 0 0 30px -10px ${res.sRGBHex}`;
      })
      .catch((err) => {
        console.log("User canceled the selection." + err);
      });
  }
}

function handleImageSelection(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => selectImage(ev.target.result);
    reader.readAsDataURL(file);
  }
}

function showFileSelecter() {
  const fileSelector = document.createElement("input");
  fileSelector.type = "file";
  fileSelector.accept = "image/*";
  fileSelector.addEventListener("change", handleImageSelection);
  fileSelector.click(); // Dosya seçim penceresini aç
}

startColorPicker.addEventListener("click", showColorPicker);
imgButton.addEventListener("click", showFileSelecter);
dominantColorRgba.addEventListener("click", () => {
  copyText(dominantColorRgba.dataset.color);
});
