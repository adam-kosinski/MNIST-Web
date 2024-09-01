// load onnx model
let session;
async function loadModel() {
  session = await ort.InferenceSession.create("./model.onnx");
}
loadModel();

async function runModel(input) {
  if (session === undefined) {
    console.warn("Model not loaded yet");
    return;
  }
  const inputTensor = new ort.Tensor("float32", input, [1, 1, 28, 28]);
  const feeds = { input: inputTensor }; // "input" is the name of the input as specified in the ONNX export

  const results = await session.run(feeds);

  const output = Array.from(results.output.data); // "output" is the name of the output as specified in the ONNX export
  const softmaxOutput = softmax(output);
  const outputObj = Object.assign({}, softmaxOutput);
  console.log(outputObj);
  displayOutput(outputObj);

  return outputObj;
}

function softmax(z) {
  let expSum = 0;
  for (const zj of z) {
    expSum += Math.exp(zj);
  }
  return z.map((zi) => Math.exp(zi) / expSum);
}

function displayOutput(output) {
  // get digit-score pairs
  const entries = Object.entries(output);
  entries.sort((a, b) => b[1] - a[1]);
  document.querySelectorAll("#output > p").forEach((p, i) => {
    p.textContent = entries[i][0];
  });
  document.querySelectorAll("#output > .bar").forEach((bar, i) => {
    bar.style.width = entries[i][1] * 100 + "%";
  });
}
