const canvas = document.getElementById("draw-canvas");
const scaleX =
  canvas.width / Number(getComputedStyle(canvas).width.split("px")[0]);
const scaleY =
  canvas.height / Number(getComputedStyle(canvas).height.split("px")[0]);

const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;
ctx.lineJoin = "round";
ctx.lineCap = "round";

// keep track of mouse coords
let prevX;
let prevY;
let mouseIsDown = false;

canvas.addEventListener("mousedown", (e) => {
  prevX = e.offsetX;
  prevY = e.offsetY;
  mouseIsDown = true;
});

document.addEventListener("mouseup", () => {
  mouseIsDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (!mouseIsDown) return;

  if (prevX !== undefined && prevY !== undefined) {
    ctx.beginPath();
    ctx.moveTo(prevX * scaleX, prevY * scaleY);
    ctx.lineTo(e.offsetX * scaleX, e.offsetY * scaleY);
    ctx.stroke();
  }
  prevX = e.offsetX;
  prevY = e.offsetY;
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
