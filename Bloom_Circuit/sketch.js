let serial;
let portName = 'COM3'; 

let gameState = 'start'; 

let startTime;
let gameDuration = 60 * 1000; 
let gameOver = false;

const tools = ['soil', 'plant', 'fix'];
let currentToolIndex = 0;

let joystickX = 0;
let joystickY = 0;
let button1 = 0;
let button2 = 0;
let lastButton2 = 0;

let tool = 'soil';
let robotPos = { x: 300, y: 200 }; 
let target = { x: 400, y: 200, restored: false };

const TILE_SIZE = 60;
let tiles = [];

const DEAD_ZONE = 5;

let ambientBase;
let sfx = {};
let nature = {};

function preload() {
  ambientBase = loadSound('sounds/ambient_base.mp3');

  sfx.dirt = loadSound('sounds/dirt.mp3');
  sfx.plant = loadSound('sounds/plant.mp3');
  sfx.activate = loadSound('sounds/activate.mp3');

  nature.birds = loadSound('sounds/birds.mp3');
  nature.wind = loadSound('sounds/wind.mp3');
  nature.river = loadSound('sounds/river.mp3');
}

function setup() {
  createCanvas(600, 400);
let cols = floor(width / TILE_SIZE);
let rows = floor(height / TILE_SIZE);
for (let x = 0; x < cols; x++) {
  tiles[x] = [];
  for (let y = 0; y < rows; y++) {
    let r = random();
    if (r < 0.1) tiles[x][y] = 'solarPanel';
    else if (r < 0.2) tiles[x][y] = 'stone';
    else tiles[x][y] = 'dirt';
  }
}
  startTime = millis();


  serial = new p5.SerialPort();
  serial.openPort(portName);
  serial.on('data', serialEvent);

  if (ambientBase.isLoaded()) {
    ambientBase.loop();
  }
  
  nature.birds.loop();
  nature.wind.loop();
  nature.river.loop();

}

function serialEvent() {
  let data = serial.readLine().trim();
  if (!data.startsWith("X:")) return;

  let parts = data.split(',');
  joystickX = map(int(parts[0].split(':')[1]), 0, 1023, -5, 5); 
  joystickY = map(int(parts[1].split(':')[1]), 0, 1023, -5, 5); 
  button1 = int(parts[2].split(':')[1]);
  button2 = int(parts[3].split(':')[1]);

  if (button2 === 1 && lastButton2 === 0) {
    currentToolIndex = (currentToolIndex + 1) % tools.length;
    tool = tools[currentToolIndex];
  }
  lastButton2 = button2;
}

function draw() {
  drawTiles();

  if (tool === 'plant') {
    serial.write("LED:0,255,0\n");
  } else if (tool === 'fix') {
    serial.write("LED:255,0,0\n"); 
  } else if (tool === 'soil') {
    serial.write("LED:0,0,255\n");
  }

  if (!gameOver) {
    let elapsed = millis() - startTime;
    let remaining = max(0, gameDuration - elapsed);
  
    fill(0);
    textSize(16);
    text("Time Left: " + floor(remaining / 1000), 10, 60);
  
    if (remaining === 0) {
      gameOver = true;
    }
  }  else {
    
    background(0, 0, 0, 150); 
    textSize(32);
    fill('red');
    text("Time's Up!", 200, 150); 

    textSize(24);
    fill('white');
    text("Thanks for Playing!", 180, 200); 

    textSize(16);
    text("BloomBot appreciates your help!", 170, 250); 

  }
  
  if (Math.abs(joystickX) < DEAD_ZONE) joystickX = 0;
  if (Math.abs(joystickY) < DEAD_ZONE) joystickY = 0;

  robotPos.x += joystickX; 
  robotPos.y += joystickY; 

  robotPos.x = constrain(robotPos.x, 0, width);
  robotPos.y = constrain(robotPos.y, 0, height);

  if (tool === 'soil') fill('brown');
  else if (tool === 'plant') fill('green');
  else if (tool === 'fix') fill('blue');

ellipse(robotPos.x, robotPos.y, 30);


  fill(0);
  textSize(14);
  text(`Tool: ${tool}`, 10, 20);

  let distToTarget = dist(robotPos.x, robotPos.y, target.x + 20, target.y + 20);
  if (button1) {
    interactWithTiles();
  }
  
  if (!target.restored && button1 && distToTarget < 40) {
    target.restored = true;

    if (tool === 'soil') sfx.dirt.play();
    else if (tool === 'plant') sfx.plant.play();
    else sfx.activate.play();

  }
}
function mousePressed() {
  if (gameState === 'start') {
    if (mouseX > width / 2 - 60 && mouseX < width / 2 + 60 &&
        mouseY > 300 && mouseY < 340) {
      gameState = 'playing';
    }
  }
}

  function drawTiles() {
    for (let x = 0; x < tiles.length; x++) {
      for (let y = 0; y < tiles[x].length; y++) {
        let tileType = tiles[x][y];
  
        switch (tileType) {
          case 'dirt':
            fill(139, 69, 19); 
            break;
          case 'solarPanel':
            fill(255,255,255); 
            break;
          case 'stone':
            fill(120);
            break;
          case 'plant0':
            fill(0, 200, 0); 
            break;
          case 'plant1':
            fill(0, 255, 100); 
            break;
          case 'solarPanelFixed':
            fill(255, 255, 0); 
            break;
            
        }
  
        rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }


  function interactWithTiles() {
    let col = floor(robotPos.x / TILE_SIZE);
    let row = floor(robotPos.y / TILE_SIZE);
  
    if (tiles[col] && tiles[col][row]) {
      let current = tiles[col][row];
  
      if (tool === 'soil' && current === 'stone') {
        tiles[col][row] = 'dirt';
        sfx.dirt.play();
      } 
      else if (tool === 'plant' && current === 'dirt') {
        tiles[col][row] = 'plant0';
        sfx.plant.play();
      }
      else if (tool === 'fix' && current === 'solarPanel') {
          tiles[col][row] = 'solarPanelFixed'; 
          sfx.activate.play(); 
      }
        
    }
  }
  

