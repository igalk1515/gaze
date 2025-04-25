let calibrationActive = false;
let calibrationPoints = [
  { x: 0.1, y: 0.1 },
  { x: 0.5, y: 0.1 },
  { x: 0.9, y: 0.1 },
  { x: 0.1, y: 0.5 },
  { x: 0.5, y: 0.5 },
  { x: 0.9, y: 0.5 },
  { x: 0.1, y: 0.9 },
  { x: 0.5, y: 0.9 },
  { x: 0.9, y: 0.9 },
];
let currentCalibrationStep = 0;
let calibrationData = [];

let collectingSamples = false;
let samplesPerPoint = 10;
let collectedSamples = [];

document
  .getElementById('calibrate-button')
  .addEventListener('click', startCalibration);

function startCalibration() {
  calibrationActive = true;
  calibrationData = [];
  currentCalibrationStep = 0;
  showCalibrationDot();
}

function showCalibrationDot() {
  const dot =
    document.getElementById('calibration-dot') || document.createElement('div');
  dot.id = 'calibration-dot';
  dot.style.position = 'absolute';
  dot.style.width = '20px';
  dot.style.height = '20px';
  dot.style.backgroundColor = 'red';
  dot.style.borderRadius = '50%';
  dot.style.zIndex = '1000';
  document.body.appendChild(dot);

  const point = calibrationPoints[currentCalibrationStep];
  dot.style.left = `${point.x * window.innerWidth - 10}px`;
  dot.style.top = `${point.y * window.innerHeight - 10}px`;

  // Start collecting samples
  collectingSamples = true;
  collectedSamples = [];
}

function collectSample() {
  if (!collectingSamples || !latestIrisPosition) return;

  collectedSamples.push({ x: latestIrisPosition.x, y: latestIrisPosition.y });

  if (collectedSamples.length >= samplesPerPoint) {
    finishCollectingPoint();
  }
}

function finishCalibration() {
  calibrationActive = false;
  document.getElementById('calibration-dot').remove();
  console.log('Calibration Done!', calibrationData);
  buildMappingModel();
}

let latestIrisPosition = null;

function updateLatestIris(x, y) {
  latestIrisPosition = { x, y };

  if (collectingSamples) {
    collectSample();
  }
}

let mapX = (x) => x * window.innerWidth;
let mapY = (y) => y * window.innerHeight;

function buildMappingModel() {
  const xs = calibrationData.map((d) => ({ raw: d.rawX, screen: d.screenX }));
  const ys = calibrationData.map((d) => ({ raw: d.rawY, screen: d.screenY }));

  const xScale =
    (xs[xs.length - 1].screen - xs[0].screen) /
    (xs[xs.length - 1].raw - xs[0].raw);
  const yScale =
    (ys[ys.length - 1].screen - ys[0].screen) /
    (ys[ys.length - 1].raw - ys[0].raw);

  const xOffset = xs[0].screen - xs[0].raw * xScale;
  const yOffset = ys[0].screen - ys[0].raw * yScale;

  mapX = (rawX) => rawX * xScale + xOffset;
  mapY = (rawY) => rawY * yScale + yOffset;

  console.log('Mapping model ready!');
}

function finishCollectingPoint() {
  collectingSamples = false;

  const avgRawX =
    collectedSamples.reduce((sum, s) => sum + s.x, 0) / collectedSamples.length;
  const avgRawY =
    collectedSamples.reduce((sum, s) => sum + s.y, 0) / collectedSamples.length;

  calibrationData.push({
    screenX: calibrationPoints[currentCalibrationStep].x * window.innerWidth,
    screenY: calibrationPoints[currentCalibrationStep].y * window.innerHeight,
    rawX: avgRawX,
    rawY: avgRawY,
  });

  currentCalibrationStep++;

  if (currentCalibrationStep < calibrationPoints.length) {
    setTimeout(showCalibrationDot, 500);
  } else {
    finishCalibration();
  }
}
