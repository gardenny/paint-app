![paint](https://user-images.githubusercontent.com/110226567/213916087-48672534-0e63-4b39-a609-471326aea375.png)

# 🎨 Paint app

자바스크립트 미니 그림판 어플 👉 [Demo](https://imjone.github.io/paint-app/)

<br />

## 📢 프로젝트 개요

Canvas API를 사용하여 제작한 바닐라 자바스크립트 미니 그림판입니다.<br />
그림판의 핵심 기능들(그리기, 채우기, 텍스트 및 이미지 삽입 등)을 구현하였으며,<br />
사용자의 눈을 보호하기 위한 다크 모드 테마를 지원합니다.

<br />

## 🗨️ 사용 기술

<p>
 <img src="https://img.shields.io/badge/HTML-e34f26?style=flat-square&logo=HTML5&logoColor=white" />
 <img src="https://img.shields.io/badge/CSS-1572b6?style=flat-square&logo=CSS3&logoColor=white" />
 <img src="https://img.shields.io/badge/JavaScript-f7df1e?style=flat-square&logo=JavaScript&logoColor=white" />
</p>

<br />

## 📋 주요 기능

- 브러쉬 사이즈 변경
- 작업 도구 모드 변경
- 컬러 피커 및 컬러 팔레트
- 작업 실행 취소 / 다시 실행
- 라이트 모드 / 다크 모드 토글링

<br />

## 💻 소스 코드

전체 코드 보러 가기 👉 [Notion](https://imjone.notion.site/Paint-app-3b7fa527999141cbbe0b2885a43fed05)

### 📍 그리기 모드 (선 그리기 / 지우개)

사용자가 마우스를 누르는 순간부터 바로 선을 그리기 시작해야 하기 때문에,<br />
canvas 위에서 마우스가 이동 중이라면 `ctx`가 실시간으로 사용자의 마우스 위치를 따라갑니다.<br />
마우스를 누르고 있을 때(`mousedown`) 그리기 모드가 시작되며, 마우스를 떼면(`mouseup`) 그리기 모드가 종료됩니다.

```javascript
function startDrawing() {
  isDrawing = true;
}

function stopDrawing() {
  isDrawing = false;
}

function handleDrawingMode(event) {
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

canvas.addEventListener('mousemove', handleDrawingMode);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
```

### 📍 삽입 모드 (색 채우기 / 텍스트 / 이미지)

현재 활성화된 모드에 따라 각각 다른 케이스가 실행됩니다.<br />
`fill` - 현재 선택된 색상으로 canvas 전체를 가득 채웁니다.<br />
`text` - `insertText` 함수를 호출하여 canvas에 텍스트를 그립니다.<br />
`image` - `insertImage` 함수를 통해 업로드된 이미지를 canvas에 그립니다.

```javascript
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
  const file = event.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file); // 이미지의 브라우저 메모리 URL에 접근
    uploadImage = document.createElement('img');
    uploadImage.src = url;
  }
}

canvas.addEventListener('click', handleInsertMode);
```

### 📍 색상 변경하기

사용자 편의성을 위해 컬러 피커 뿐만 아니라 인기 색상을 모아 놓은 컬러 팔레트 또한 함께 제공합니다.<br />
원하는 색상을 클릭하면 `ctx`의 색상이 `data-color` 속성에 정의된 색상으로 변경됩니다.

```html
<div class="color-option" style="background: #880015" data-color="#880015"></div>
<div class="color-option" style="background: #ed1c24" data-color="#ED1C24"></div>
<div class="color-option" style="background: #ff7f27" data-color="#FF7F27"></div>
<div class="color-option" style="background: #fff200" data-color="#FFF200"></div>
<div class="color-option" style="background: #22b14c" data-color="#22B14C"></div>
<div class="color-option" style="background: #00a2e8" data-color="#00A2E8"></div>
<div class="color-option" style="background: #3f48cc" data-color="#3F48CC"></div>
<div class="color-option" style="background: #a349a4" data-color="#A349A4"></div>
...
```
```javascript
function clickColorOption(event) {
  const colorOption = event.target.dataset.color;
  if (!colorOption) return;
  ctx.strokeStyle = colorOption;
  ctx.fillStyle = colorOption;
  colorPicker.value = colorOption;
}
```

<br />

## 😊 배운 점 및 느낀 점

- Canvas 라는 새로운 API를 사용해볼 수 있어 정말 신기하고 재밌는 경험이었습니다.
- 문제가 발생했을 때 코드의 흐름을 차근차근 따라가며 답을 찾아나가는 힘을 기를 수 있었습니다.
- 이미지 드래그 및 도형 삽입 등의 조금 더 그림판스러운(?) 기능을 함께 구현하지 못해 아쉽습니다.
