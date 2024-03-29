'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = Math.floor(window.innerHeight * 0.9);

const headerMenu = document.querySelector('.header-menu');
const rangeInput = document.querySelector('.range-input');
const rangeBar = document.querySelector('.range-bar');
const rangeValue = document.querySelector('.range-value');
const brushSize = document.querySelector('.brush-size');
const toolBox = document.querySelector('.tools');
const imageBtn = document.querySelector('.btn-img');
const fileInput = document.querySelector('.file-input');
const textInput = document.querySelector('.text-input');
const fontFamily = document.querySelector('.font-family');
const fontWeight = document.querySelector('.font-weight');
const fontSize = document.querySelector('.font-size');
const clearBtn = document.querySelector('.btn-clear');
const colorBox = document.querySelector('.color-box');
const colorPicker = document.querySelector('.color-picker');

const tools = Object.freeze({
  draw: 'draw',
  fill: 'fill',
  text: 'text',
  image: 'image',
  erase: 'erase',
  clear: 'clear',
});
const fonts = [
  new FontFace('Pretendard-Regular', 'url(https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff)'),
  new FontFace('NanumSquareNeo-Variable', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2)'),
  new FontFace('Binggrae', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Binggrae.woff)'),
  new FontFace('establishRoomNo703OTF', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2112@1.0/establishRoomNo703OTF.woff)'),
  new FontFace('BMJUA', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff)'),
  new FontFace('Cafe24Ssurround', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24Ssurround.woff)'),
  new FontFace('D2Coding', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_three@1.0/D2Coding.woff)'),
];

let isLoaded = false;
let currentMode = tools.draw; // default
let isDrawing = false;
let canvasState = [];
let step = -1;
let data = [];
let uploadImage;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.cursor = `url(img/cursor/draw.cur) 0 32, auto`;
ctx.lineWidth = rangeBar.value;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
fonts.forEach(font => font.load().then(() => document.fonts.add(font)));

function startDrawing() {
  isDrawing = true;
}

function stopDrawing() {
  isDrawing = false;
}

function handleDrawingMode(event) {
  // 마우스 이벤트 좌표
  const x = event.offsetX;
  const y = event.offsetY;

  if (isDrawing) {
    ctx.lineTo(x, y);
    ctx.stroke();

    switch (currentMode) {
      case tools.draw:
        ctx.strokeStyle = colorPicker.value;
        break;
      case tools.erase:
        ctx.strokeStyle = '#ffffff';
      default:
        break;
    }
  }
  ctx.beginPath(); // 이전에 그려진 canvas의 path와 연결 끊어줌
  ctx.moveTo(x, y); // 사용자의 마우스 위치로 ctx 실시간 이동
}

function handleInsertMode(event) {
  switch (currentMode) {
    case tools.fill:
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      break;
    case tools.text:
      insertText(event);
      break;
    case tools.image:
      if (uploadImage) ctx.drawImage(uploadImage, event.offsetX, event.offsetY);
      break;
    default:
      return;
  }
}

function insertText(event) {
  const text = textInput.value;
  if (!text) return;
  for (let i = 0; i < fonts.length; i++) {
    if (fontFamily.value === fonts[i].family) {
      ctx.font = `${fontWeight.value} ${fontSize.value}pt ${fonts[i].family}`;
      fonts[i].load().then(() => ctx.fillText(text, event.offsetX, event.offsetY));
    } else {
      ctx.font = `${fontWeight.value} ${fontSize.value}pt ${fontFamily.value}`;
      ctx.fillText(text, event.offsetX, event.offsetY);
    }
  }
}

function insertImage(event) {
  const file = event.target.files[0]; // 사용자가 업로드한 이미지
  if (file) {
    const url = URL.createObjectURL(file); // 이미지의 브라우저 메모리 URL에 접근
    uploadImage = document.createElement('img');
    uploadImage.src = url;
  }
}

function clearCanvas() {
  if (window.confirm('작업을 초기화할까요?')) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    canvasState = [];
    step = -1;
    textInput.value = '';
    uploadImage = '';
  }
}

function changeMode(event) {
  const target = event.target.nodeName === 'BUTTON' || event.target.nodeName === 'LABEL' ? event.target : event.target.parentNode;
  currentMode = target.dataset.mode;
  if (!currentMode) return;

  const activated = document.querySelector('.activated');
  activated.classList.remove('activated');
  target.classList.add('activated');

  switch (currentMode) {
    case 'draw':
      canvas.style.cursor = 'url(img/cursor/draw.cur) 0 24, auto';
      break;
    case 'fill':
      canvas.style.cursor = 'url(img/cursor/fill.cur), auto';
      break;
    case 'text':
      canvas.style.cursor = 'url(img/cursor/text.cur) 0 24, text';
      break;
    case 'image':
      canvas.style.cursor = 'url(img/cursor/image.cur), crosshair';
      break;
    case 'erase':
      canvas.style.cursor = 'url(img/cursor/eraser.cur) 0 24, auto';
      break;
    case 'clear':
      canvas.style.cursor = 'default';
      clearCanvas();
      break;
    default:
      return;
  }
}

function moveRangeBar(event) {
  const currentWidth = event.target.value;
  ctx.lineWidth = currentWidth;
  rangeValue.value = currentWidth;
}

function changeRangeValue(event) {
  const currentValue = parseInt(event.target.value);
  const maxValue = parseInt(event.target.max);
  ctx.lineWidth = currentValue;
  rangeBar.value = currentValue;

  if (!currentValue) {
    ctx.lineWidth = 1;
    rangeBar.value = 1;
    rangeValue.value = 1;
  } else if (currentValue > maxValue) {
    ctx.lineWidth = maxValue;
    rangeBar.value = maxValue;
    rangeValue.value = maxValue;
  }
}

function runValidation(event) {
  const key = event.key;
  switch (key) {
    case '+':
    case '-':
    case 'e':
      event.preventDefault();
      break;
    case 'Enter':
      rangeValue.blur();
    default:
      break;
  }
}

function selectBrushSize(event) {
  const target = event.target.className === 'size-px' ? event.target : event.target.parentNode;
  const currentSize = target.dataset.pixel;
  if (target.className === 'size-px') {
    ctx.lineWidth = currentSize;
    rangeBar.value = currentSize;
    rangeValue.value = currentSize;
  }
}

function clickColorOption(event) {
  const colorOption = event.target.dataset.color;
  if (!colorOption) return;
  ctx.strokeStyle = colorOption;
  ctx.fillStyle = colorOption;
  colorPicker.value = colorOption;
}

function clickColorPicker(event) {
  const pickedColor = event.target.value;
  ctx.strokeStyle = pickedColor;
  ctx.fillStyle = pickedColor;
}

function saveImage() {
  // canvas 내의 그림 및 이미지들을 URL로 인코딩
  const url = canvas.toDataURL();
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'myDrawing.png'; // download: href에 있는 콘텐츠 다운로드
  anchor.click(); // 클릭 시 이미지.png 다운로드
  anchor.remove();
}

function saveCanvasState() {
  if ((currentMode === tools.text && !textInput.value) || (currentMode === tools.image && !uploadImage)) return;
  step++;
  if (step < canvasState.length) canvasState.length = step;

  // 사용자가 그린 그림을 url 형태로 canvasState 배열에 저장
  canvasState.push(canvas.toDataURL());
  // console.log(step);
}

function undoCanvas() {
  if (step > 0) {
    step--;
    // console.log(step);

    const previousImage = document.createElement('img');
    previousImage.src = canvasState[step];
    previousImage.addEventListener('load', () => {
      // 캔버스를 초기화한 후, 바로 직전에 저장된 그림 url(previousDataUrl)을 불러와서 다시 그려냄
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(previousImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    });
  } else if (step === 0) {
    step = -1;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function redoCanvas() {
  if (step < canvasState.length - 1) {
    step++;
    // console.log(step);

    const nextImage = document.createElement('img');
    nextImage.src = canvasState[step];
    nextImage.addEventListener('load', () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(nextImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    });
  }
}

function keydownEvent(event) {
  if (event.ctrlKey && event.key === 'z') {
    undoCanvas();
  } else if (event.ctrlKey && event.key === 'y') {
    redoCanvas();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('theme-dark');
  const willChangeImages = document.querySelectorAll('[data-change]');
  willChangeImages.forEach(beforeImage => {
    const afterImage = beforeImage.dataset.change;
    if (document.body.classList.contains('theme-dark')) beforeImage.src = `img/${afterImage}-dark.png`;
    else beforeImage.src = `img/${afterImage}.png`;
  });
}

canvas.addEventListener('contextmenu', event => event.preventDefault());
canvas.addEventListener('mousemove', handleDrawingMode);
canvas.addEventListener('mousedown', () => {
  if (currentMode === tools.draw || currentMode === tools.erase) startDrawing();
});
canvas.addEventListener('mouseup', () => {
  stopDrawing();
  if (currentMode === tools.draw || currentMode === tools.erase) saveCanvasState();
});
canvas.addEventListener('mouseleave', () => {
  if (isDrawing) saveCanvasState();
  stopDrawing();
});
canvas.addEventListener('click', event => {
  if (currentMode === tools.draw || currentMode === tools.erase) return;
  handleInsertMode(event);
  saveCanvasState();
});

headerMenu.addEventListener('click', event => {
  const target = event.target.nodeName === 'BUTTON' ? event.target : event.target.parentNode;
  const btn = target.dataset.btn;
  switch (btn) {
    case 'save':
      saveImage();
      break;
    case 'undo':
      undoCanvas();
      break;
    case 'redo':
      redoCanvas();
      break;
    case 'theme':
      toggleDarkMode();
      break;
    default:
      break;
  }
});
rangeBar.addEventListener('input', moveRangeBar);
rangeValue.addEventListener('input', changeRangeValue);
rangeValue.addEventListener('keydown', runValidation);
brushSize.addEventListener('click', selectBrushSize);
toolBox.addEventListener('click', changeMode);
fileInput.addEventListener('change', insertImage);
document.addEventListener('keydown', keydownEvent);
colorBox.addEventListener('click', clickColorOption);
colorPicker.addEventListener('change', clickColorPicker);
