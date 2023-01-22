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
