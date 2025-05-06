const BOARD = document.querySelector(".board");
const SCORE_BOARD = document.querySelector(".score-points");
const COLUMNS = 100;
const ROWS = 100;
const FOOD_POINT = 10;

/**
 *
 */
let BOARD_CELLS = [];

/**
 *
 */
let GAME_LOOP_INTERVAL;

/**
 *
 */
let STATE;

window.addEventListener("mousedown", (event) => {
  STATE.clicked = event.button == 0;
});

window.addEventListener("mouseup", (event) => {
  STATE.clicked = event.button == 0 ? false : STATE.clicked;
});

// Resize Event
window.addEventListener("resize", async function (event) {
  const width = document.querySelector(".board").clientWidth;
  const heigth = document.querySelector(".board").clientHeight;

  BOARD_CELLS.forEach((cols) =>
    cols.forEach((e) => CellStyles(e, width, heigth))
  );
});

// OnReady Event
document.addEventListener("DOMContentLoaded", async function (event) {
  await InitializeCanvas();
  NewCanvasState();
});

/**
 *
 */
async function InitializeCanvas() {
  DrawBoard();

  let pixals = await GetPixel("./image.jpg", 100, 100);


  let index = 0;

  for (let col = 0; col < COLUMNS; col++) {
    for (let row = 0; row < ROWS; row++) {
      BOARD_CELLS[col][row].style.backgroundColor = `${RgbaToHex(...pixals[index])}`;

      
      index++
    }
  }

  console.log(pixals.length);
}

function RgbaToHex(r, g, b, a = 255) {
  const alpha = (a / 255).toFixed(3); // Normalize alpha to 0–1
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 *
 * @returns {object}
 */
function NewCanvasState() {
  STATE = {
    clicked: false,
  };
}

/**
 *
 */
function DrawBoard() {
  const width = document.querySelector(".board").clientWidth;
  const heigth = document.querySelector(".board").clientHeight;

  for (let col = 0; col < COLUMNS; col++) {
    BOARD_CELLS.push([]);

    for (let row = 0; row < ROWS; row++) {
      BOARD_CELLS[col].push(document.createElement("div"));
      BOARD_CELLS[col][row].classList.add("cell");

      CellStyles(BOARD_CELLS[col][row], width, heigth);

      BOARD.append(BOARD_CELLS[col][row]);

      // BOARD_CELLS[col][row].addEventListener("mouseover", () => Draw(BOARD_CELLS[col][row]))
    }
  }
}

/**
 *
 * @param {HTMLDivElement} cell
 */
function Draw(cell) {
  console.log("YEs....");

  if (!STATE.clicked) {
    return;
  }

  cell.classList.add("active");
}

async function GetPixel(url, x, y) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.src = url;

    img.onload = () => {
      const context = document.createElement("canvas").getContext("2d");
      context.drawImage(img, 0, 0);
      const { data } = context.getImageData(10, 10, img.width, img.height);
      const pixels = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        pixels.push([r, g, b, a]);
      }

      resolve(pixels);
    };
  });
}

/**
 *
 * @param {HTMLDivElement} cell
 * @param {number} width
 * @param {number} heigth
 */
function CellStyles(cell, width, heigth) {
  cell.style.width = `${width / ROWS - 1}px`;
  cell.style.height = `${heigth / COLUMNS - 1}px`;
  // cell.style.width = `${width / ROWS}px`;
  // cell.style.height = `${heigth / COLUMNS}px`;
}
