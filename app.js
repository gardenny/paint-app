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
