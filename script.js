// --- SPREMENLJIVKE ---
var ctx, canvas, intervalId, timerIntervalId;
var WIDTH = 300;
var HEIGHT = 300;

// Žogica
var x = 150, y = 150;
var dx = 2, dy = 4;
var r = 10;

// Plošček (paddle)
var paddlex, paddleh, paddlew;
var rightDown = false;
var leftDown = false;

// Opeke (bricks)
var bricks;
var NROWS = 5;
var NCOLS = 5;
var BRICKWIDTH, BRICKHEIGHT, PADDING;
var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];

// Igra (status, točke, čas)
var tocke = 0;
var start = true;
var sekunde = 0;
var izpisTimer = "00:00";


// --- INICIALIZACIJA ---
function init() {
    ctx = $('#canvas')[0].getContext("2d");
   
    init_paddle();
    initbricks();
   
    tocke = 0;
    $("#tocke").html(tocke);
   
    sekunde = 0;
    $("#cas").html(izpisTimer);
   
    // Zagon glavne zanke in časovnika
    intervalId = setInterval(draw, 10);
    timerIntervalId = setInterval(posodobiCas, 1000);
}

function init_paddle() {
    paddleh = 10;
    paddlew = 75;
    paddlex = (WIDTH / 2) - (paddlew / 2);
}

function initbricks() {
    BRICKWIDTH = (WIDTH / NCOLS) - 1;
    BRICKHEIGHT = 15;
    PADDING = 1;
    bricks = new Array(NROWS);
    for (var i = 0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (var j = 0; j < NCOLS; j++) {
            bricks[i][j] = 1; // 1 pomeni, da opeka obstaja
        }
    }
}


// --- POMOŽNE FUNKCIJE ZA RISANJE ---
function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}


// --- KONTROLE (Tipkovnica) ---
function onKeyDown(evt) {
    if (evt.keyCode == 39) rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 39) rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);


// --- ČASOVNIK ---
function posodobiCas() {
    if (start == true) {
        sekunde++;
        var sekundeI = sekunde % 60;
        var minuteI = Math.floor(sekunde / 60);
       
        sekundeI = (sekundeI > 9) ? sekundeI : "0" + sekundeI;
        minuteI = (minuteI > 9) ? minuteI : "0" + minuteI;
       
        izpisTimer = minuteI + ":" + sekundeI;
        $("#cas").html(izpisTimer);
    }
}


// --- GLAVNA ZANKA (Draw) ---
function draw() {
    clear();
   
    // 1. Premik ploščka
    if (rightDown) {
        if ((paddlex + paddlew) < WIDTH) paddlex += 5;
        else paddlex = WIDTH - paddlew;
    } else if (leftDown) {
        if (paddlex > 0) paddlex -= 5;
        else paddlex = 0;
    }
   
    // Risanje ploščka in žogice
    ctx.fillStyle = "#000000";
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    ctx.fillStyle = "#333333";
    circle(x, y, r);

    // 2. Risanje opek in detekcija trka žogice z opeko
    for (var i = 0; i < NROWS; i++) {
        ctx.fillStyle = rowcolors[i];
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j] == 1) {
                var brickX = (j * (BRICKWIDTH + PADDING)) + PADDING;
                var brickY = (i * (BRICKHEIGHT + PADDING)) + PADDING;
                rect(brickX, brickY, BRICKWIDTH, BRICKHEIGHT);
               
                // Trk z opeko
                var rowheight = BRICKHEIGHT + PADDING;
                var colwidth = BRICKWIDTH + PADDING;
                var row = Math.floor(y / rowheight);
                var col = Math.floor(x / colwidth);
               
                if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
                    dy = -dy;
                    bricks[row][col] = 0; // Uniči opeko
                    tocke += 1; // Dodaj točko
                    $("#tocke").html(tocke);
                }
            }
        }
    }

    // 3. Odboji od sten
    if (x + dx > WIDTH - r || x + dx < r) {
        dx = -dx;
    }
    if (y + dy < r) {
        dy = -dy;
    }
    // Trk ob dno (ali plošček)
    else if (y + dy > HEIGHT - r - paddleh) {
        if (x > paddlex && x < paddlex + paddlew) {
            // Dinamičen odboj glede na to, kje na plošček prileti žogica
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
            start = true; // Znova zaženi časovnik, če je bil ustavljen
        } else if (y + dy > HEIGHT - r) {
            // Konec igre (žogica pade mimo ploščka)
            start = false;
            clearInterval(intervalId);
            clearInterval(timerIntervalId);
            alert("Konec igre! Zbral/a si " + tocke + " točk.");
        }
    }

    // 4. Posodobitev koordinat žogice
    x += dx;
    y += dy;
}

// Poženi igro, ko je dokument pripravljen
$(document).ready(function() {
    init();
});