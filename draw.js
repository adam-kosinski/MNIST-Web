const canvas = document.getElementById("draw-canvas");
const scaleX =
  canvas.width / Number(getComputedStyle(canvas).width.split("px")[0]);
const scaleY =
  canvas.height / Number(getComputedStyle(canvas).height.split("px")[0]);

const ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.lineWidth = 1.5;
ctx.lineJoin = "round";
ctx.lineCap = "round";

// keep track of mouse coords
let prevX;
let prevY;
let mouseIsDown = false;

canvas.addEventListener("pointerdown", (e) => {
  prevX = e.offsetX;
  prevY = e.offsetY;
  mouseIsDown = true;
});

document.addEventListener("pointerup", () => {
  mouseIsDown = false;
});

canvas.addEventListener("pointermove", (e) => {
  e.preventDefault();
  if (!mouseIsDown) return;

  if (prevX !== undefined && prevY !== undefined) {
    ctx.beginPath();
    ctx.moveTo(prevX * scaleX, prevY * scaleY);
    ctx.lineTo(e.offsetX * scaleX, e.offsetY * scaleY);
    ctx.stroke();
  }
  prevX = e.offsetX;
  prevY = e.offsetY;

  runModel(getModelInput());
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  displayOutput(Object.assign({}, Array(10).fill(0)));
});

function getModelInput() {
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelValues = [];
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const pixel_index = y * img.width + x;
      const alpha = img.data[4 * pixel_index + 3];
      pixelValues.push(alpha / 255);
    }
  }
  return pixelValues;
}
