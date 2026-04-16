// canvas in risanje
var ctx;
var canvas;

// velikost igralnega polja
var WIDTH = 300;
var HEIGHT = 300;

// žogica: položaj, hitrost, radij
var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var r = 10;

// ploščica
var paddlex;
var paddleh;
var paddlew;

// tipke za premikanje ploščice
var rightDown = false;
var leftDown = false;

// opeke
var bricks;
var NROWS = 5;
var NCOLS = 10;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;

// barve elementov
var paddlecolor = "#000000";
var ballcolor = "#666666";

// točke, čas in stanje igre
var tocke = 0;
var sekunde = 0;
var izpisTimer = "00:00";
var intervalId = null;
var timerIntervalId = null;
var start = false;
var gameStarted = false;

// težavnost / level
var currentLevel = 1;
var selectedLevel = false;

// slike za bricke
var brickImages = [];

brickImages[1] = new Image();
brickImages[1].src = "img/img1.png";

brickImages[2] = new Image();
brickImages[2].src = "img/img2.png";

brickImages[3] = new Image();
brickImages[3].src = "img/img3.png";

brickImages[4] = new Image();
brickImages[4].src = "img/img4.png";

brickImages[5] = new Image();
brickImages[5].src = "img/img5.png";

// slika tal
var floorImg = new Image();
floorImg.src = "img/floor.png";

// glavna inicializacija igre
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  initLevel();
  resetBall();

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  document.getElementById("tocke").textContent = tocke;
  document.getElementById("cas").textContent = izpisTimer;

  draw();
}

// nastavi težavnost / level
function initLevel() {
  if (currentLevel === 1) {
    NROWS = 5;
    NCOLS = 10;
    paddlew = 110;
  } else if (currentLevel === 2) {
    NROWS = 10;
    NCOLS = 15;
    paddlew = 90;
  } else if (currentLevel === 3) {
    NROWS = 10;
    NCOLS = 20;
    paddlew = 70;
  }

  paddleh = 10;
  paddlex = WIDTH / 2 - paddlew / 2;

  initbricks();
}

// inicializacija ploščice
function init_paddle() {
  paddleh = 10;
  paddlex = WIDTH / 2 - paddlew / 2;
}

// inicializacija tabele opek
function initbricks() {
  BRICKWIDTH = (WIDTH / NCOLS) - 2;
  BRICKHEIGHT = 20;
  PADDING = 2;

  bricks = new Array(NROWS);

  for (var i = 0; i < NROWS; i++) {
    bricks[i] = new Array(NCOLS);

    for (var j = 0; j < NCOLS; j++) {
      if (currentLevel === 1) {
        bricks[i][j] = 5 - i;
      } else {
        bricks[i][j] = 5 - Math.floor(i / 2);
      }
    }
  }
}

// ponastavitev žogice
function resetBall() {
  x = WIDTH / 2;
  y = HEIGHT / 2;

  if (currentLevel === 1) {
    dx = 2;
    dy = 4;
  } else if (currentLevel === 2) {
    dx = 2.5;
    dy = 4.5;
  } else if (currentLevel === 3) {
    dx = 3;
    dy = 5;
  }
}

// risanje kroga
function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// risanje pravokotnika
function rect(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}

// brisanje canvasa
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// pritisk tipke
function onKeyDown(evt) {
  if (evt.keyCode === 39) {
    rightDown = true;
  } else if (evt.keyCode === 37) {
    leftDown = true;
  }
}

// spust tipke
function onKeyUp(evt) {
  if (evt.keyCode === 39) {
    rightDown = false;
  } else if (evt.keyCode === 37) {
    leftDown = false;
  }
}

// prikaz overlay besedila
function showOverlay(text) {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("overlayText").textContent = text;
}

// skrij overlay
function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}

// izbira levela z gumbom
function setLevel(level) {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  intervalId = null;
  timerIntervalId = null;

  currentLevel = level;
  selectedLevel = true;
  gameStarted = false;
  start = false;

  tocke = 0;
  sekunde = 0;
  izpisTimer = "00:00";

  initLevel();
  init_paddle();
  resetBall();

  document.getElementById("tocke").textContent = tocke;
  document.getElementById("cas").textContent = izpisTimer;

  showOverlay("LEVEL " + currentLevel);
  draw();
}

// zagon igre
function startGame() {
  if (!selectedLevel) {
    showOverlay("NAJPREJ IZBERI LEVEL");
    return;
  }

  if (gameStarted) {
    return;
  }

  hideOverlay();

  start = true;
  gameStarted = true;

  intervalId = setInterval(draw, 10);
  timerIntervalId = setInterval(timer, 1000);
}

// ponovni začetek igre
function restartGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  intervalId = null;
  timerIntervalId = null;

  tocke = 0;
  sekunde = 0;
  izpisTimer = "00:00";
  start = true;
  gameStarted = true;

  initLevel();
  init_paddle();
  resetBall();

  document.getElementById("tocke").textContent = tocke;
  document.getElementById("cas").textContent = izpisTimer;

  hideOverlay();

  intervalId = setInterval(draw, 10);
  timerIntervalId = setInterval(timer, 1000);
}

// timer za prikaz časa igre
function timer() {
  if (start === true) {
    sekunde++;

    var sekundeI = sekunde % 60;
    var minuteI = Math.floor(sekunde / 60);

    sekundeI = sekundeI > 9 ? sekundeI : "0" + sekundeI;
    minuteI = minuteI > 9 ? minuteI : "0" + minuteI;

    izpisTimer = minuteI + ":" + sekundeI;
    document.getElementById("cas").textContent = izpisTimer;
  }
}

// skupno število brickov v levelu
function getTotalBricksForLevel() {
  return NROWS * NCOLS;
}

// glavna funkcija igre
function draw() {
  clear();

  // tla spodaj
  ctx.drawImage(floorImg, 0, HEIGHT - 60, WIDTH, 60);

  // vidna odbojna linija
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT - paddleh);
  ctx.lineTo(WIDTH, HEIGHT - paddleh);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (rightDown) {
    if (paddlex + paddlew < WIDTH) {
      paddlex += 5;
    } else {
      paddlex = WIDTH - paddlew;
    }
  } else if (leftDown) {
    if (paddlex > 0) {
      paddlex -= 5;
    } else {
      paddlex = 0;
    }
  }

  for (var i = 0; i < NROWS; i++) {
    for (var j = 0; j < NCOLS; j++) {
      if (bricks[i][j] > 0) {
        ctx.drawImage(
          brickImages[bricks[i][j]],
          (j * (BRICKWIDTH + PADDING)) + PADDING,
          (i * (BRICKHEIGHT + PADDING)) + PADDING,
          BRICKWIDTH,
          BRICKHEIGHT
        );
      }
    }
  }

  ctx.fillStyle = paddlecolor;
  rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

  ctx.fillStyle = ballcolor;
  circle(x, y, r);

  var rowheight = BRICKHEIGHT + PADDING;
  var colwidth = BRICKWIDTH + PADDING;
  var row = Math.floor(y / rowheight);
  var col = Math.floor(x / colwidth);

  if (y < NROWS * rowheight && row >= 0 && row < NROWS && col >= 0 && col < NCOLS && bricks[row][col] > 0) {
    dy = -dy;
    bricks[row][col]--;

    if (bricks[row][col] === 0) {
      tocke += 1;
      document.getElementById("tocke").textContent = tocke;
    }
  }

  if (x + dx > WIDTH - r || x + dx < r) {
    dx = -dx;
  }

  if (y + dy < r) {
    dy = -dy;
  } else if (y + dy > HEIGHT - r - paddleh) {
    if (x > paddlex && x < paddlex + paddlew) {
      dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
      dy = -dy;
    } else if (y + dy > HEIGHT - r) {
      start = false;
      gameStarted = false;
      clearInterval(intervalId);
      clearInterval(timerIntervalId);
      showOverlay("KONEC IGRE - Točke: " + tocke);
    }
  }

  x += dx;
  y += dy;

  if (tocke === getTotalBricksForLevel()) {
    start = false;
    gameStarted = false;
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    showOverlay("ZMAGA - LEVEL " + currentLevel);
  }
}

// zagon priprave ob nalaganju strani
window.onload = init;