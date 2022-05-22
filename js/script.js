const canvas = document.querySelector("canvas");
canvas.height = 600;
canvas.width = 600;

const worker = new Worker("js/canvas.js", { type: "module" });
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({canvas: offscreen}, [offscreen]);