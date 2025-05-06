const BOARD = document.querySelector(".board");
const SCORE_BOARD = document.querySelector(".score-points");
const COLUMNS = 30;
const ROWS = 50; 
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
  alert(
    "----------------------------------\r\n" +
    "           GamePlay Controls      \r\n" +
    "----------------------------------\r\n" +
    "w = Up\r\n" +
    "s = Down\r\n" +
    "d = Right\r\n" +
    "a = Left\r\n" 
  );

  InitializeGame();
});

/**
 *
 */
function InitializeGame() {
  DrawBoard();
  NewGameState();
  SetScore(STATE.points);
  GameLoop();
  AddFood();
}

/**
 *
 */
function ResetGame() {
  clearInterval(GAME_LOOP_INTERVAL);
  BOARD.innerHTML = "";
  BOARD_CELLS = [];
}

/**
 * @param {number} score 
 */
function SetScore(score) {
    SCORE_BOARD.innerHTML = score;
}

/**
 * 
 * @returns {object}
 */
function NewGameState() {
  STATE = {
    points: 0,
    moving: "s",
    body: [
      {
        row: 0,
        column: 0,
      },
    ],
    tail: {
      row: null,
      column: null,
    },
    food: {
      row: null,
      column: null,
    },
  };
}

/**
 *
 */
function GameLoop() {
  GAME_LOOP_INTERVAL = setInterval(Move, 1000 / 15);
}

/**
 *
 */
function AddFood() {
  row = Math.floor(Math.random() * ROWS);
  column = Math.floor(Math.random() * COLUMNS);

  for (let i = 0; i < STATE.body.length; i++) {
    if (row == STATE.body[i].row && column == STATE.body[i].column) {
      return AddFood();
    }
  }

  GetBlock(row, column).classList.add("food");

  STATE.food.row = row;
  STATE.food.column = column;
}

/**
 *
 */
function EatFood() {
  const tail = {
    row: STATE.tail.row,
    column: STATE.tail.column,
  };

  STATE.body.push(tail);
  GetBlock(STATE.food.row, STATE.food.column).classList.remove("food");
  GetBlock(tail.row, tail.column).classList.add("active");
  SetScore(STATE.points += FOOD_POINT)
  AddFood();
}

/**
 *
 */
function Move() {
  switch (STATE.moving) {
    case "w":
      ChangePosition(STATE.body[0].row, STATE.body[0].column - 1);
      break;
    case "d":
      ChangePosition(STATE.body[0].row + 1, STATE.body[0].column);
      break;
    case "s":
      ChangePosition(STATE.body[0].row, STATE.body[0].column + 1);
      break;
    case "a":
      ChangePosition(STATE.body[0].row - 1, STATE.body[0].column);
      break;
  }
}

// Keypress Event
document.addEventListener("keypress", async function (event) {
  if (STATE.body.length > 1) {
    // Disable opposite movement...
    if (
      (event.key == "w" && STATE.moving == "s") ||
      (event.key == "s" && STATE.moving == "w")
    ) {
      return;
    }
    // Disable opposite movement...
    if (
      (event.key == "a" && STATE.moving == "d") ||
      (event.key == "d" && STATE.moving == "a")
    ) {
      return;
    }
  }

  STATE.moving = ["w", "d", "s", "a"].includes(event.key)
    ? event.key
    : STATE.moving;
});

/**
 *
 * @param {*} row
 * @param {*} column
 * @returns {boolean}
 */
function BodyCollision(row, column) {
  if (STATE.body.length < 5) {
    return false;
  }

  for (let i = 5; i < STATE.body.length; i++) {
    if (row == STATE.body[i].row && column == STATE.body[i].column) {
      return true;
    }
  }

  return false;
}

/**
 * @param {number} column
 * @param {number} row
 */
function ChangePosition(row, column) {
  if (row >= ROWS) {
    row = 0;
  }

  if (row < 0) {
    row = ROWS - 1;
  }

  if (column >= COLUMNS) {
    column = 0;
  }

  if (column < 0) {
    column = COLUMNS - 1;
  }

  let next = {
    row: row,
    column: column,
  };

  // Eating food because
  if (next.row == STATE.food.row && next.column == STATE.food.column) {
    EatFood();
  }

  if (BodyCollision(row, column)) {
    alert("GAME OVER!!!\r\nPress Ok to reset");
    ResetGame();
    InitializeGame();
    return;
  }

  STATE.tail.row = STATE.body[STATE.body.length - 1].row;
  STATE.tail.column = STATE.body[STATE.body.length - 1].column;

  for (let i = 0; i < STATE.body.length; i++) {
    const row = next.row;
    const column = next.column;

    GetBlock(STATE.body[i].row, STATE.body[i].column).classList.remove("active");
    GetBlock(next.row, next.column).classList.add("active");

    next.row = STATE.body[i].row;
    next.column = STATE.body[i].column;

    STATE.body[i].row = row;
    STATE.body[i].column = column;
  }
}

/**
 *
 * @param {*} row
 * @param {*} column
 * @returns
 */
function GetBlock(row, column) {
  return BOARD_CELLS[column][row] ?? null;
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

      // Snake
      if (col == 0 && row == 0) {
        BOARD_CELLS[col][row].classList.add("active");
      }
    }
  }
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
}
