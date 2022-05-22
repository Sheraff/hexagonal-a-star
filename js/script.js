const button = document.querySelector('button');
button.addEventListener('click', () => onSeed(generateSeed()))

const canvas = document.querySelector("canvas");
const side = Math.min(window.innerHeight, window.innerWidth) * window.devicePixelRatio;
canvas.height = side;
canvas.width = side;
const worker = new Worker("js/canvas.js", { type: "module" });
const offscreen = canvas.transferControlToOffscreen();
worker.postMessage({canvas: offscreen}, [offscreen]);

const url = new URL(location.href)
let seed = url.searchParams.get("seed") || generateSeed();
onSeed(seed);

function onSeed(seed) {
	url.searchParams.set("seed", seed)
	history.replaceState(null, null, url.href)
	worker.postMessage({seed});
}

function generateSeed() {
	return String(Math.round(1_000_000_000_000 * Math.random()))
}