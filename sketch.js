// this is some initial stuff to define, canvas size, number of squares can be changed here, nothing else.
let width = 400;
let height = 400;
let myGrid = [];
let gap = 20;
let first = 0;
let startPoint = false;
let endPoint = false;
let startPosition;
let endPosition;
let released = false;

//make every single square in the canvas an object of the class "points"
function setup() {
  createCanvas(400, 400);
  for(let i = 0; i < width / gap; i++){
    myGrid.push([])
    for(let j = 0; j < height / gap; j++){
      myGrid[i][j] = new Points(i * gap, j * gap);
    }
  }
}

//if the letter c is pressed, the board resets.
function keyTyped(){
  if (key === "c") {
    setup()
  }
}
// this draws the lines, and colours the squares in depending on what they are, e.g. barricade, end position, start position, path, checked...
function draw() {
  background(255);
  let finalPath = algorithm();
  for(let i = 0; i < width / gap; i++){
    for(let j = 0; j < height / gap; j++){
      if(myGrid[i][j].current() ===  "black"){
        fill(0)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "blue"){
        fill(0, 0, 255)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "green"){
        fill(0, 255, 0)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "purple"){
        fill(128,0,128)
        rect(i * gap, j * gap, gap, gap)
      }
      if(myGrid[i][j].current() === "yellow"){
        fill(255,255,0)
        rect(i * gap, j * gap, gap, gap)
      }
        
    }
  }
  for(let i = 0; i < width / gap; i++){
    line(i * gap, 0, i * gap, height)
  }
  for(let j = 0; j < height / gap; j++){
    line(0, j * gap, width, j * gap)
  }
  // call the algorithm at the end to check if the final position and initial position has been put onto the canvas
  if(finalPath.length > 0){
    noLoop()
  }
}

//as mouse is being dragged the point either becomes a white point to black point, or vice versa.
function mouseDragged(){
    posX = mouseX
    posY = mouseY
    row = Math.floor(posX / gap)
    column = Math.floor(posY / gap)
    newposX = pmouseX
    newposY = pmouseY;
    if (posX != newposX && posY != newposY){
      row = int(row)
      column = int(column)
      myGrid[row][column].change()
    }
}
//if the mouse is oouble clicked, the row and column of the square pressed is found, then if it's the first time this has happened then the square is the intial point, if second, the end point, else, doesn't do anything

function doubleClicked(){
  posX = mouseX
  posY = mouseY
  row = Math.floor(posX / gap)
  column = Math.floor(posY / gap)
  if(first === 0){
      myGrid[row][column].initial()
      startPoint = true;
      startPosition = myGrid[row][column];
    }
    else if(first === 1){
      myGrid[row][column].end()
      endPoint = true;
      endPosition = myGrid[row][column];
    }
    //this makes sure that after first is higher than 1, there can't be multiple final or start positions
    first ++
}
//the actual a star algorithm
function algorithm(){
  //check if the start and final position have been plotted
  if(startPoint === true && endPoint === true){
    //add the heuristic distance to the start position from the final position
    startPosition.h = distance([startPosition.x, startPosition.y]);
    
    //assign every node with their h values, might be unecessary...
    let openList = []
    for(let i = 0; i < width / gap; i++){
      for(let j = 0; j < width / gap; j++){
        myGrid[i][j].h = distance([myGrid[i][j].x, myGrid[i][j].y])
        myGrid[i][j].f = myGrid[i][j].g + myGrid[i][j].h
      }
    }
    openList.push(startPosition)
    let closedList = []
      while (openList.length > 0){
        //find what the node with the best f value is
        lowPos = 0;
        for(let i = 0; i < openList.length; i++){
          if(openList[i].f < openList[lowPos].f){
            lowPos = i;
          }
        }
        let currentPosition = openList[lowPos];
        //currentPosition.check()
        //if the currentPosition is the endPosition, retrace steps and find the path, then return this path
        if(currentPosition === endPosition){
          let curr = currentPosition;
          let ret = [];
          while(curr.parent != null){
            curr.path()
            ret.push(curr);
            curr = curr.parent;
          }
          endPosition.end()
          return ret.reverse();
        }
        openList.splice(lowPos, 1);
        closedList.push(currentPosition);
        let neighbours = neighbors(currentPosition);
        for(let i = 0; i < neighbours.length; i++){
          let neighbour = neighbours[i];
          if(closedList.includes(neighbour) || neighbour.colour == "black"){
            continue;
          }
          //colours blocks purple indicating that it has been checked.
          
          
          let gScore = currentPosition.g + 1;
          let gScoreBest = false;
          //check if we have checked this node before
          if(openList.includes(neighbour) == false){
            gScoreBest = true;
            openList.push(neighbour);
          }
          //if we haven't and there is a better score, than change the score of the neighbour
          else if(gScore < neighbour.g){
            gScoreBest = true;
          }
          //the current best path
          if(gScoreBest == true){
            neighbour.check()
            neighbour.parent = currentPosition;
            neighbour.g = gScore;
            neighbour.f = neighbour.g + neighbour.h;
          }
        }
      }
  }
  //meaning that either the path is not possible or the final node/initial node has not yet been placed.
  return [];
}

//this is the euclidean distance of the node passed to it, and the final node, e.g. the heuristic, I prefer the euclidean to the manhattan distance, since I believe that it makes it more accurate.
function distance(randomPosition){
  startX = randomPosition[0];
  startY = randomPosition[1];
  finalX = endPosition.x;
  finalY = endPosition.y;
  heuristic = ((finalX - startX) ** 2 + (finalY - startY) ** 2);
  heuristic = heuristic ** (1 / 2)
  return heuristic;
}

// find each neighbour of the node passed to it
function neighbors(node){
  let ret = [];
  let nodeX = Math.floor(node.x / gap);
  let nodeY = Math.floor(node.y / gap);
  //first check if the neighbour is within the canvas, if yes then add it onto the neighbour list and return it at the end
  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j++){
      if(j == 0 && i == 0){
        continue;
      }
      if(0 <= nodeX + i && nodeX + i < width / gap && 0 <= nodeY + j && nodeY + j < height / gap){
        ret.push(myGrid[nodeX + i][nodeY + j]);
      }
    }
  }
  return ret;
}
