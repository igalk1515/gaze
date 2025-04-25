const video = document.getElementById('video');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

const gazePoints = [];
let smoothedX = null;
let smoothedY = null;

function onResults(results) {
  if (!results.multiFaceLandmarks.length) return;

  const landmarks = results.multiFaceLandmarks[0];

  const iris = landmarks[468];

  updateLatestIris(iris.x, iris.y);

  const rawX = mapX(iris.x);
  const rawY = mapY(iris.y);

  if (smoothedX === null) {
    smoothedX = rawX;
    smoothedY = rawY;
  } else {
    smoothedX = smoothedX * 0.8 + rawX * 0.2;
    smoothedY = smoothedY * 0.8 + rawY * 0.2;
  }

  gazePoints.push({
    x: Math.floor(smoothedX),
    y: Math.floor(smoothedY),
    weight: 1,
  });

  const canvasX = smoothedX * (canvas.width / window.innerWidth);
  const canvasY = smoothedY * (canvas.height / window.innerHeight);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
}

setInterval(() => {
  if (gazePoints.length === 0) return;

  fetch('http://localhost:5000/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points: gazePoints }),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      let img = document.getElementById('heatmap-img');
      if (!img) {
        img = document.createElement('img');
        img.id = 'heatmap-img';
        img.style.position = 'absolute';
        img.style.bottom = '10px';
        img.style.right = '10px';
        img.style.width = '300px';
        img.style.border = '2px solid black';
        document.body.appendChild(img);
      }
      img.src = url;
    });

  gazePoints.length = 0;
}, 1000);

const faceMesh = new FaceMesh({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
faceMesh.onResults(onResults);

const camera = new Camera(video, {
  onFrame: async () => await faceMesh.send({ image: video }),
  width: 640,
  height: 480,
});
camera.start();
