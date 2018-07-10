const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 900;
const cw = canvas.width;
const ch = canvas.height;
const topCanvas = canvas.offsetTop;
const leftCanvas = canvas.offsetLeft;
const menuButtonX = 100;
const menuButtonY = 40;
let gameOn = false;
let mouseIsDown = false;
let waypointDone = 0;
const pointSize = 4;
const mouseError = 80;
const correctWaypoint = 20;

const spellStupifyX = [600, 565, 530, 495, 460, 425, 390, 355, 320,285,250,285,320,355,390,425,460,495,530,565,600,635,670,705];
const spellStupifyY = [350, 375, 400, 425, 450, 475, 500, 525, 550,575,600,597,594,591,588,585,582,579,576,573,570,567,564,561];
const spells = ["Stupify"];

const waypointyX = [450, 500, 500, 470, 430, 380, 380, 390, 420, 450, 490, 530, 570, 610, 640, 650, 630, 580];
const waypointyY = [450, 475, 400, 380, 380, 400, 430, 480, 500, 520, 525, 530, 520, 470, 420, 380, 330, 280];
let choosenSpellX = [];
let choosenSpellY = [];

table();


setInterval(game, 1000 / 30);

function game() {

    if (gameOn == true) {
        czarujemy();
        bagietto();
    } else {
        table();
    }
}


function przegrana() {
    console.log("loose");
    waypointDone = 0;
    gameOn = false;
}
function wygrana() {
    console.log("wygrana");
    waypointDone = 0;
    gameOn = false;
    init();
}
function czarujemy() {
    if (mouseIsDown) {
        canvas.addEventListener("mousemove", mousePosition);
    }

    addEventListener("mousedown", function () {
        mouseIsDown = true;
    });
    canvas.addEventListener("mouseup", function () {
        canvas.removeEventListener("mousemove", mousePosition);
        mouseIsDown = false;
        if (gameOn == true) przegrana();
    });
}

function table() {
    ctx.fillStyle = "#090909";
    ctx.fillRect(0, 0, cw, ch);

    if (gameOn == false) {
        let pozStartX = cw / 2 - menuButtonX / 2 -50;
        let pozStartY = ch / 2 - menuButtonY / 2;

        for (let a=0; a<spells.length; a++){
            drawButtons(pozStartX, pozStartY,a);
        }


    }
}
function drawButtons(pozStartX, pozStartY, a) {
    ctx.fillStyle = "white";
    ctx.fillRect(pozStartX+(a*(menuButtonX+50)), pozStartY, menuButtonX, menuButtonY);

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
    ctx.fillText(spells[a], pozStartX+menuButtonX/2+(a*(menuButtonX+50)), ch / 2);

    canvas.addEventListener("mouseup", function (e) {
        if (    e.clientX - leftCanvas > pozStartX+(a*(menuButtonX+50))
            && e.clientX - leftCanvas < pozStartX+(a*(menuButtonX+50)) + menuButtonX
            && e.clientY - topCanvas > pozStartY
            && e.clientY - topCanvas < pozStartY + menuButtonY) {
            gameOn = true;

            choosenSpellX = eval('spell'+spells[a]+'X');
            choosenSpellY = spellStupifyY;
            console.log(choosenSpellX);
            table();
        }

    })
}

function bagietto() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(choosenSpellX[0], choosenSpellY[0]);
    for (let i = 1; i < choosenSpellX.length; i++) {
        ctx.lineTo(choosenSpellX[i], choosenSpellY[i]);
    }
    ctx.stroke();
}


function mousePosition(e) {
    let pozX = e.clientX - leftCanvas;
    let pozY = e.clientY - topCanvas;
    if (gameOn == true) {
        for (let i = 0; i < choosenSpellX.length; i++) {
            if
            ((pozX > choosenSpellX[i] - correctWaypoint) &&
            (pozX < choosenSpellX[i] + correctWaypoint) &&
            (pozY > choosenSpellY[i] - correctWaypoint) &&
            (pozY < choosenSpellY[i] + correctWaypoint) && (waypointDone == i)) {
                console.log("trafiles w " + i + " waypoint");
                waypointDone++;

            }
            else if
            (((pozX < choosenSpellX[i] - mouseError) ||
                (pozX > choosenSpellX[i] + mouseError) ||
                (pozY < choosenSpellY[i] - mouseError) ||
                (pozY > choosenSpellY[i] + mouseError)) && (waypointDone == i)) {
                przegrana();
            }
            else if (waypointDone == choosenSpellX.length) {
                wygrana();
            }
        };

        ctx.fillStyle = "#ff2626";
        ctx.beginPath();
        ctx.arc(pozX, pozY, pointSize, 0, Math.PI * 2, true);
        ctx.fill();
    }
}



var c = document.querySelector('canvas'),
    width = c.width = cw,
    height = c.height = ch,


    fw1, fw2, //firework objects
    minStrength = 1.5, //lowest firework power
    maxStrength = 7, //highest firework power
    minTrails = 7, //min particles
    maxTrails = 30, //max particles
    particleRadius = 2,
    trailLength = 15, //particle trail length
    delay = .5, // number of LIFEs between explosions

    LIFE = 150, //life time of firework

    g = 5e-2, //strength of gravity
    D = 1e-3; //strength of drag (air resistance)

// Particle Class
var Particle = function (x, y, vx, vy, ax, ay, colour) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.life = LIFE; //only here for opacity in .draw() method
    this.path = [];
    this.colour = colour;
    this.r = particleRadius;

    this.update = function () {
        this.life--;

        // add point to path but if full, remove a point first
        if (this.path.length >= trailLength) this.path.shift();
        this.path.push([this.x, this.y])

        // update speed n position n stuff
        this.vy += this.ay;
        this.vx += this.ax;
        this.x += this.vx;
        this.y += this.vy;
    }

    this.draw = function () {
        var opacity = ~~(this.life * 100 / LIFE) / 100;

        // tail      
        ctx.fillStyle = 'rgba(' + this.colour + (opacity * 0.4) + ')';
        if (this.life > LIFE * 0.95) ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x - this.r, this.y);
        var i = this.path.length - 1;
        ctx.lineTo(this.path[0][0], this.path[0][1]);
        ctx.lineTo(this.x + this.r, this.y);
        ctx.closePath();
        ctx.fill();

        // main dot
        ctx.fillStyle = 'rgba(' + this.colour + opacity + ')';
        if (this.life > LIFE * 0.95) ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(~~this.x, ~~this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}


var Firework = function () {
    this.x = width * (Math.random() * 0.8 + 0.1); // from 0.1-0.9 widths
    this.y = height * (Math.random() * 0.8 + 0.1); // from 0.1-0.9 heights
    this.strength = Math.random() * (maxStrength - minStrength) + minStrength;
    this.colour = ~~(Math.random() * 255) + ',' +
        ~~(Math.random() * 255) + ',' +
        ~~(Math.random() * 255) + ',';
    this.life = 0;
    this.particles = (function (x, y, strength, colour) {
        var p = [];

        var n = ~~(Math.random() * (maxTrails - minTrails)) + minTrails;
        var ay = g;
        for (var i = n; i--;) {
            var ax = D;
            var angle = i * Math.PI * 2 / n;
            if (angle < Math.PI) ax *= -1;
            var vx = strength * Math.sin(angle);
            var vy = strength * Math.cos(angle);
            p.push(new Particle(x, y, vx, vy, ax, ay, colour));
        }

        return p;
    })(this.x, this.y, this.strength, this.colour);

    this.update = function () {
        this.life++;
        if (this.life < 0) return;
        for (var i = this.particles.length; i--;) {
            this.particles[i].update();
            this.particles[i].draw();
        }
    }
};



function main() {
    if (gameOn == false) {

        fw1.update();
        fw2.update();

        if (fw1.life == LIFE * delay) fw2 = new Firework;
        if (fw2.life == LIFE * delay) fw1 = new Firework;

        window.requestAnimationFrame(main);
    }
}

function init() {
    fw1 = new Firework;
    fw2 = new Firework;
    main();

}





